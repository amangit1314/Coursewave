export async function GET() {
  return new Response("UploadThing API", { status: 200 });
}

export async function POST() {
  return new Response("Method not implemented", { status: 501 });
}