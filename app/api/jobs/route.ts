
import { NextRequest, NextResponse } from "next/server";
import { searchIndeedJobs } from "@/lib/indeed";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const query = searchParams.get("q")?.trim() || "";
    const country = searchParams.get("country")?.trim() || "";
    const location = searchParams.get("location")?.trim() || "";
    const remote = searchParams.get("remote") === "true";

    const pageParam = Number(searchParams.get("page") || "1");
    const limitParam = Number(searchParams.get("limit") || "20");

    const page = Number.isFinite(pageParam)
      ? Math.max(1, Math.floor(pageParam))
      : 1;

    const limit = Number.isFinite(limitParam)
      ? Math.min(50, Math.max(1, Math.floor(limitParam)))
      : 20;

    const result = await searchIndeedJobs({
      query,
      country,
      location,
      remote,
      page,
      limit,
    });

    return NextResponse.json(
      {
        success: true,
        source: "Indeed",
        ...result,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("Job Board API Error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Unable to load jobs right now.";

    return NextResponse.json(
      {
        success: false,
        source: "Indeed",
        jobs: [],
        total: 0,
        error: message,
      },
      { status: 500 }
    );
  }
}