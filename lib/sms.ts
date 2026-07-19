import "server-only";

/**
 * Sends an SMS via Kavenegar (https://kavenegar.com). This calls the same
 * REST endpoint (`/v1/{apikey}/sms/send.json`) their official `kavenegar`
 * npm package wraps internally — that package is just a thin, untyped,
 * callback-style shim around Node's `https` module calling this exact URL,
 * so hitting it directly with `fetch` keeps this Promise/async-friendly and
 * avoids an extra dependency with no TypeScript types.
 *
 * Silently no-ops (logs a warning, returns ok:false) until KAVENEGAR_API_KEY
 * is set as an env var — so task-assignment notifications work immediately
 * without SMS, and SMS turns on the moment the key is added, no further code
 * changes needed. KAVENEGAR_SENDER is optional — omit it to use the account's
 * default line.
 */
export async function sendSms(phone: string, message: string): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.KAVENEGAR_API_KEY;
  if (!apiKey) {
    console.warn("[sms] KAVENEGAR_API_KEY not set — skipping SMS to", phone);
    return { ok: false, error: "SMS not configured" };
  }

  try {
    const params = new URLSearchParams({ receptor: phone, message });
    const sender = process.env.KAVENEGAR_SENDER;
    if (sender) params.set("sender", sender);

    const res = await fetch(`https://api.kavenegar.com/v1/${apiKey}/sms/send.json`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
      body: params.toString(),
    });
    const body = await res.json().catch(() => null);
    if (!res.ok || body?.return?.status !== 200) {
      const error = body?.return?.message || `HTTP ${res.status}`;
      console.error("[sms] Kavenegar send failed:", error);
      return { ok: false, error };
    }
    return { ok: true };
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    console.error("[sms] Kavenegar send threw:", error);
    return { ok: false, error };
  }
}
