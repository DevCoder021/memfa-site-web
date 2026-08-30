import { NextResponse } from "next/server";
import { z, ZodSchema } from "zod";

export function formatZodErrors(err: z.ZodError): string {
  return err.issues
    .map((i) => `${i.path.join(".")} : ${i.message}`)
    .join(" ; ");
}

export async function parseBody<T extends ZodSchema>(
  req: Request,
  schema: T
): Promise<{ ok: true; data: z.infer<T> } | { ok: false; response: NextResponse }> {
  try {
    const raw = await req.json();
    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      return {
        ok: false,
        response: NextResponse.json(
          { error: formatZodErrors(parsed.error) },
          { status: 400, headers: { "Cache-Control": "no-store" } }
        ),
      };
    }
    return { ok: true, data: parsed.data };
  } catch {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Body JSON invalide" },
        { status: 400, headers: { "Cache-Control": "no-store" } }
      ),
    };
  }
}

export async function parseSearchParams<T extends ZodSchema>(
  url: URL,
  schema: T
): Promise<{ ok: true; data: z.infer<T> } | { ok: false; response: NextResponse }> {
  const raw: Record<string, string> = {};
  url.searchParams.forEach((v, k) => {
    raw[k] = v;
  });
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: formatZodErrors(parsed.error) },
        { status: 400, headers: { "Cache-Control": "no-store" } }
      ),
    };
  }
  return { ok: true, data: parsed.data };
}
