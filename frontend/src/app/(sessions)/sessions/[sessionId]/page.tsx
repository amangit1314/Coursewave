"use client";

import { useParams } from "next/navigation";
import { Suspense } from "react";
// import SessionDetailsClient from "./session-details-client-component";

export default function SessionDetails() {
  const params = useParams<{ sessionId: string }>();
  const sessionId = params?.sessionId;

  return (
    <div>Session Id: {sessionId}</div>
    // <Suspense fallback={""}>
    //   some
    //   {/* <SessionDetailsClient sessionId={sessionId} /> */}
    // </Suspense>
  );
}
