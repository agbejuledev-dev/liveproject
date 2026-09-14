import { NextResponse } from "next/server";

export async function POST() {
    return NextResponse.json(
        {
            success: false,
            demo: true,
            message: "Payment initialization is disabled in demo mode."
        },
        { status: 501 }
    );
}
