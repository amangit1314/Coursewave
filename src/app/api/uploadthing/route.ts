import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = 'force-dynamic';

import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,

  // Apply an (optional) custom config:
  // config: { ... },
});

// export const GET = async (req: NextRequest) => {
//   try {
//     const reqBody = await req.json();
//     const { id } = reqBody;

//     if (!id) {
//       return NextResponse.json({
//         status: 'ERROR',
//         success: false,
//         message: 'id is a required field ...',
//       }, { status: 400 });
//     }

//     const instructor = await db.instructor.findUnique({
//       where: {
//         instructorID: id,
//       }
//     });

//     if (!instructor) {
//       return NextResponse.json({
//         status: 'ERROR',
//         success: false,
//         message: `There is no instructor with this id: ${id} ...`,
//       }, { status: 404 });
//     }

//     console.log(`Instructor Data: ${JSON.stringify(instructor)}`);
//     console.log(`Instructor Data: ${instructor}`);
//     return NextResponse.json({
//       status: 'OK',
//       success: true,
//       data: instructor,
//       message: 'Instructor found ✔️ ...',
//     }, { status: 200 });
//   } catch (error: any) {
//     console.log(`Internal server error in uploading: ${error.message} ❌🚧 ...`)
//     return NextResponse.json({
//       status: 'OK',
//       success: true,
//       error: error.message,
//       message: 'Internal server error in uploading ❌🚧 ...',
//     }, { status: 200 });
//   }
// }