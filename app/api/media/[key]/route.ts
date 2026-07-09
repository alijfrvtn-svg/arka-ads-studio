// Serves files uploaded through the admin Media Library (stored in the
// global Netlify Blobs "media" store). Publicly readable — media URLs are
// meant to be embedded on public pages — with long-lived caching since a
// given key's content never changes (delete + re-upload gets a new key).
import { NextRequest, NextResponse } from "next/server";
import { getStore } from "@netlify/blobs";

export const runtime = "nodejs";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;

  try {
    const store = getStore("media");
    const result = await store.getWithMetadata(key, { type: "arrayBuffer" });
    if (!result || !result.data) {
      return new NextResponse("Not found", { status: 404 });
    }
    const contentType = (result.metadata?.contentType as string) || "application/octet-stream";
    return new NextResponse(result.data as ArrayBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
