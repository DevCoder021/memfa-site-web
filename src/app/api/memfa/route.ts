import { NextRequest, NextResponse } from "next/server";

const DEFAULT_API_URL = "http://localhost/memfa-api/public";

const fallbackData: Record<string, unknown> = {
  getActualites: [],
  getLivres: [],
  getAudios: [],
  getLiveStatus: { is_active: false },
};

export async function GET(request: NextRequest) {
  const action = request.nextUrl.searchParams.get("action");
  const fallback = fallbackData[action ?? ""] ?? null;

  if (!action || fallback === null) {
    return NextResponse.json({ error: "Action invalide" }, { status: 400 });
  }

  const backendUrl = new URL(process.env.MEMFA_API_URL || DEFAULT_API_URL);
  backendUrl.search = request.nextUrl.search;

  try {
    const response = await fetch(backendUrl, {
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`);
    }

    return NextResponse.json(await response.json());
  } catch {
    return NextResponse.json(fallback);
  }
}