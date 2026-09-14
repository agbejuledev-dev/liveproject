import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const userId =
      typeof body?.userId === "string"
        ? body.userId.trim()
        : "";

    const email =
      typeof body?.email === "string"
        ? body.email.trim()
        : "";

    if (!userId || !email) {
      return NextResponse.json(
        { error: "Authenticated user information is required." },
        { status: 401 }
      );
    }

    const priceId = process.env.STRIPE_PRICE_ID;

    if (!priceId) {
      return NextResponse.json(
        { error: "STRIPE_PRICE_ID is not configured." },
        { status: 500 }
      );
    }

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",

      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],

      customer_email: email,

      client_reference_id: userId,

      metadata: {
        userId,
        email,
        product: "liveproject-premium",
      },

      subscription_data: {
        metadata: {
          userId,
          email,
          product: "liveproject-premium",
        },
      },

      allow_promotion_codes: true,

      success_url:
        `${appUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url:
        `${appUrl}/payment/cancelled`,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe checkout URL was not returned." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      url: session.url,
    });
  } catch (error) {
    console.error("Stripe checkout error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to create checkout session.",
      },
      { status: 500 }
    );
  }
}
