import { Suspense } from "react";
// import SessionDetailsClient from "./session-details-client-component";

export default async function SessionDetails({ 
  params 
}: { 
  params: Promise<{ sessionId: string }> 
}) {
  const { sessionId } = await params;
  
  return (
    <Suspense fallback={""}>
      some
      {/* <SessionDetailsClient sessionId={sessionId} /> */}
    </Suspense>
  );
} 