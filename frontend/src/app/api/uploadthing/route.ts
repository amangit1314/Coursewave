import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

import cors, { runMiddleware } from '@/lib/cors';
import { NextRequest, NextResponse } from "next/server";

// Handle the OPTIONS request
export async function OPTIONS(req: NextRequest) {
  await runMiddleware(req, NextResponse, cors);
  return new NextResponse('OK', { status: 200 });
}

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  // config: { ... },
});
