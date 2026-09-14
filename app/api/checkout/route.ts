import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    success: true,
    demo: true,
    message: "Demo checkout enabled.",
    checkoutUrl: "/checkout/success",
  });
}
