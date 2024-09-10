"use client";

import { getToken } from "@/app/_actions/actions";
import { generateUid } from "@/helpers/id-helper";
import {useUserInfo} from "@/hooks/useUserInfo";
import { User } from "@prisma/client";
import { StreamVideo, StreamVideoClient } from "@stream-io/video-react-sdk";
import { Loader, Loader2 } from "lucide-react";
import React from "react";

interface ClientProviderProps {
  children: React.ReactNode;
}

const VideoSDKClientProvider = ({ children }: ClientProviderProps) => {
  const videoClient = useInitializeVideoClient();

  if (!videoClient) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="mx-auto animate-spin" />
      </div>
    );
  }

  return <StreamVideo client={videoClient}>{children}</StreamVideo>;
};

export default VideoSDKClientProvider;

const useInitializeVideoClient = () => {
  const { user, isLoading, error } = useUserInfo();
  const [videoClient, setVideoClient] =
    React.useState<StreamVideoClient | null>(null);

  React.useEffect(() => {
    if (isLoading) return;

    let streamUser: { id: string; name: string; profileImageUrl: string };

    if (user?.id) {
      streamUser = {
        id: user.id,
        name: user.name || user.id,
        profileImageUrl: user.profileImageUrl || "",
      };
    } else {
      // const id = generateUid();
      // streamUser = {
      //   id: id,
      //   name: `Guest ${id}`,
      //   profileImageUrl: "",
      // };
      throw new Error("Authentication is necessary ...")
    }

    const streamApiKey = process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY;

    if (!streamApiKey) {
      console.log(
        "[STREAM_SERVER_ACTION_ERROR]: (src/app/_actions/actions.ts) Stream API key not set ...",
      );
      throw new Error(
        "[STREAM_SERVER_ACTION_ERROR]: (src/app/_actions/actions.ts) Stream API key not set ...",
      );
    }

    const client = new StreamVideoClient({
      apiKey: streamApiKey,
      user: streamUser,
      tokenProvider: user?.id ? getToken : undefined,
    });

    setVideoClient(client);

    // cleanup function
    return () => {
        client.disconnectUser();
        setVideoClient(null);
    }
  }, [isLoading, user?.id, user?.name, user?.profileImageUrl]);

  return videoClient;
};
