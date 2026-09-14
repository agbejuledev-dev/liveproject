import Stripe from "stripe";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

async function setPremium(
  userId: string,
  email: string
) {
  if (!userId && !email) {
    throw new Error("No user identifier was provided.");
  }

  let query = supabaseAdmin
    .from("profiles")
    .update({
      plan: "premium",
      premium_status: "active",
    });

  if (userId) {
    query = query.eq("id", userId);
  } else {
    query = query.eq("email", email);
  }

  const { error } = await query;

  if (error) {
    throw error;
  }
}

async function setFree(
  userId: string,
  email: string
) {
  if (!userId && !email) {
    throw new Error("No user identifier was provided.");
  }

  let query = supabaseAdmin
    .from("profiles")
    .update({
      plan: "free",
      premium_status: "inactive",
    });

  if (userId) {
    query = query.eq("id", userId);
  } else {
    query = query.eq("email", email);
  }

  const { error } = await query;

  if (error) {
    throw error;
  }
}

export async function POST(request: Request) {
  const signature =
    request.headers.get("stripe-signature");

  const webhookSecret =
    process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature) {
    return new NextResponse(
      "Missing Stripe signature.",
      { status: 400 }
    );
  }

  if (!webhookSecret) {
    return new NextResponse(
      "STRIPE_WEBHOOK_SECRET is not configured.",
      { status: 500 }
    );
  }

  const rawBody = await request.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      webhookSecret
    );
  } catch (error) {
    console.error(
      "Stripe webhook verification failed:",
      error
    );

    return new NextResponse(
      "Invalid webhook signature.",
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session =
          event.data.object as Stripe.Checkout.Session;

        const userId =
          session.metadata?.userId ||
          session.client_reference_id ||
          "";

        const email =
          session.metadata?.email ||
          session.customer_details?.email ||
          session.customer_email ||
          "";

        await setPremium(userId, email);
        break;
      }

      case "customer.subscription.updated": {
        const subscription =
          event.data.object as Stripe.Subscription;

        const userId =
          subscription.metadata?.userId || "";

        const email =
          subscription.metadata?.email || "";

        const active =
          subscription.status === "active" ||
          subscription.status === "trialing";

        if (active) {
          await setPremium(userId, email);
        } else {
          await setFree(userId, email);
        }

        break;
      }

      case "customer.subscription.deleted": {
        const subscription =
          event.data.object as Stripe.Subscription;

        const userId =
          subscription.metadata?.userId || "";

        const email =
          subscription.metadata?.email || "";

        await setFree(userId, email);
        break;
      }

      case "invoice.paid": {
        const invoice =
          event.data.object as Stripe.Invoice;

        if (
          typeof invoice.subscription !==
          "string"
        ) {
          break;
        }

        const subscription =
          await stripe.subscriptions.retrieve(
            invoice.subscription
          );

        const userId =
          subscription.metadata?.userId || "";

        const email =
          subscription.metadata?.email || "";

        await setPremium(userId, email);
        break;
      }

      case "invoice.payment_failed": {
        const invoice =
          event.data.object as Stripe.Invoice;

        if (
          typeof invoice.subscription !==
          "string"
        ) {
          break;
        }

        const subscription =
          await stripe.subscriptions.retrieve(
            invoice.subscription
          );

        const userId =
          subscription.metadata?.userId || "";

        const email =
          subscription.metadata?.email || "";

        await setFree(userId, email);
        break;
      }

      default:
        break;
    }

    return NextResponse.json({
      received: true,
    });
  } catch (error) {
    console.error(
      "Stripe webhook processing error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Webhook processing failed.",
      },
      { status: 500 }
    );
  }
}
