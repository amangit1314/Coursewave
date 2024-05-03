import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";

export const dynamic = "force-dynamic";

const vapidKeys = {
  publicKey: process.env.WEB_PUSH_PUBLIC_KEY,
  privateKey: process.env.WEB_PUSH_PRIVATE_KEY,
};

webpush.setVapidDetails(
  process.env.NEXT_PUBLIC_APP_URL,
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

let subscriptions = [];

export const PATCH = async (req) => {
  const subscription = req.body;
  subscriptions.push(subscription);

  NextResponse.json(
    { status: "success", data: subscriptions },
    { status: 201 }
  );
};

export const POST = async (req) => {
  const reqBody = await req.json();
  const { title, body, icon, url } = reqBody;

  const notificationPayload = {
    title: title || "New notification",
    body: body || "This is a new notification",
    icon: icon || "https://some-image-url.jpg",
    data: {
      url: url || "https://example.com",
    },
  };

  Promise.all(
    subscriptions.map((subscription) =>
      webpush.sendNotification(
        subscription,
        JSON.stringify(notificationPayload)
      )
    )
  )
    .then(() => {
      console.error("Notification sent successfully ...");
      NextResponse.json(
        {
          status: "ok",
          data: notificationPayload,
          message: "Notification sent successfully.",
        },
        { status: 200 }
      );
    })
    .catch((err) => {
      console.error("Error sending notification");

      NextResponse.json(
        {
          status: "ERROR",
          error: err.message,
          message: "Failed to send notification ...",
        },
        { status: 500 }
      );
    });
};
