"use client";

import { getToken } from "@/app/_actions/actions";
import { User } from "@/types";
import { useUserStore } from "@/zustand/userStore";
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
  const { user, loadingState } = useUserStore();
  const [videoClient, setVideoClient] =
    React.useState<StreamVideoClient | null>(null);

  React.useEffect(() => {
    if (loadingState.loading) return;

    // If there's an authentication error, don't initialize the client
    if (loadingState.error) {
      console.warn("Video SDK: Authentication error, skipping client initialization:", loadingState.error);
      return;
    }

    let streamUser: { id: string; name: string; profileImageUrl: string };

    if (user?.id) {
      streamUser = {
        id: user.id,
        name: user.name || user.id,
        profileImageUrl: user.profileImageUrl || "",
      };
    } else {
      // Don't throw error, just return without initializing
      console.warn("Video SDK: No user found, skipping client initialization");
      return;
    }

    const streamApiKey = process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY;

    if (!streamApiKey) {
      console.warn(
        "[STREAM_SERVER_ACTION_ERROR]: (src/app/_actions/actions.ts) Stream API key not set ...",
      );
      return;
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
  }, [loadingState.loading, user?.id, user?.name, user?.profileImageUrl, loadingState.error]);

  return videoClient;
};
