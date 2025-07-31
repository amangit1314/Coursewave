"use server";
import { User } from "@prisma/client";
// import { cookies } from "next/headers";
import { StreamClient } from "@stream-io/node-sdk";

export const getToken = async () => {
  const streamApiKey = process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY;
  const streamApiSecret = process.env.STREAM_VIDEO_API_SECRET;

  if (!streamApiKey || !streamApiSecret) {
    console.log(
      "[STREAM_SERVER_ACTION_ERROR]: (src/app/_actions/actions.ts) Stream API key or secret not set in ...",
    );
    throw new Error(
      "[STREAM_SERVER_ACTION_ERROR]: (src/app/_actions/actions.ts) Stream API key or secret not set in ...",
    );
  }

  const userResponse = await fetch("/api/auth/me");

  if (!userResponse.ok) {
    console.error(
      "[USER_INFO_ERROR_IN_SERVER_ACTION]: (src/app/_actions/actions.ts) Failed to get user info ...",
    );
    throw new Error(
      "[USER_INFO_ERROR_IN_SERVER_ACTION]: (src/app/_actions/actions.ts) Failed to get user info ...",
    );
  }

  const userData = await userResponse.json();
  const user: User = userData?.data!;

  console.log(
    "[USER_ID_FOR_WHICH_TOKEN_GENERATION_INSTANTIATED]: Generating token for user: ",
    user?.id,
  );

  if (!user) {
    console.error(
      "[USER_AUTHORIZATION_ERROR_IN_SERVER_ACTION]: (src/app/_actions/actions.ts) user not authenticated ...",
    );
    throw new Error(
      "[USER_AUTHORIZATION_ERROR_IN_SERVER_ACTION]: (src/app/_actions/actions.ts) user not authenticated ...",
    );
  }

  const streamClient = new StreamClient(streamApiKey, streamApiSecret);

  const expirationTime = Math.floor(Date.now() / 1000) + 60 * 60;
  const issuedAt = Math.floor(Date.now() / 1000) - 60;

  const streamToken = streamClient.createToken(
    user.id,
    expirationTime,
    issuedAt,
  );

  console.log("[TOKEN_SUCCESSFULLY_GENERATED], TOKEN: ", streamToken);

  return streamToken;
};
