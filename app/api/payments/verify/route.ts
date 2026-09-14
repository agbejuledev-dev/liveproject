import { NextResponse } from "next/server";

export async function POST() {
    return NextResponse.json(
        {
            success: false,
            demo: true,
            message: "Payment verification is disabled in demo mode."
        },
        { status: 501 }
    );
}
