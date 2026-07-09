// Real file upload endpoint for the admin Media Library.
// Requires an authenticated admin session with the "media.manage"
// permission (same guard used by the existing media server actions).
// Files are stored in a global Netlify Blobs store named "media" and
// served back through /api/media/[key].
import { NextRequest, NextResponse } from "next/server";
import { getStore } from "@netlify/blobs";
import { requirePermission } from "@/lib/auth";

export const runtime = "nodejs";

// Netlify Functions have a request-body ceiling well under typical video
// sizes, so direct uploads are capped conservatively here. For full-length
// videos, use the Aparat/YouTube link field instead (better anyway — real
// video CDN + streaming, no storage cost on our side).
const MAX_SIZE = 8 * 1024 * 1024; // 8MB
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "video/mp4",
  "video/webm",
  "video/quicktime",
]);

export async function POST(req: NextRequest) {
  try {
    await requirePermission("media.manage");
  } catch {
    return NextResponse.json({ error: "دسترسی غیرمجاز است." }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "درخواست نامعتبر است." }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "فایلی ارسال نشده است." }, { status: 400 });
  }
  if (file.size === 0) {
    return NextResponse.json({ error: "فایل خالی است." }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "حجم فایل بیشتر از حد مجاز (۲۵ مگابایت) است." }, { status: 400 });
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: "نوع فایل پشتیبانی نمی‌شود." }, { status: 400 });
  }

  const ext = (file.name.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "");
  const key = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${ext ? `.${ext}` : ""}`;

  try {
    const store = getStore("media");
    const buffer = await file.arrayBuffer();
    await store.set(key, buffer, {
      metadata: { contentType: file.type, originalName: file.name },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `ذخیره‌سازی فایل ناموفق بود: ${message}` }, { status: 500 });
  }

  return NextResponse.json({ ok: true, url: `/api/media/${key}`, key });
}
