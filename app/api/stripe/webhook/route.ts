import { NextResponse } from "next/server";

export async function POST() {
    return NextResponse.json({
        received: true,
        demo: true,
        message: "Stripe webhook is disabled in demo mode."
    });
}
