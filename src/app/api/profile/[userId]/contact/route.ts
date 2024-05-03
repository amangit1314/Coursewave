import { sendContactEmail } from "@/helpers/send_email_helper";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const reqBody = await req.json();
  const {toEmail, fromEmail, message, phone, name } = reqBody;

  try {

    if (!name || !fromEmail || !toEmail || !message || !phone) {
      console.error("ERROR: [MISSING_REQUIRED_FIELDS] in sending contact email ...");
      return NextResponse.json({
        status: false,
        message: "ERROR: [MISSING_REQUIRED_FIELDS] in sending contact email ⚠👮‍♂️..",
      }, { status: 402 });
    }

    sendContactEmail(
      toEmail,
      fromEmail,
      "Coursewave Asking for help",
      "This email is reagarding the query and help for the coursewave",
      `<p>  Name: ${name} <br /> Phone Number: ${phone}  <br /> Message: ${message} </p>`,
      () => {
        console.log("Contact Email sent 🗯📧 ");
        return NextResponse.json({
          status: true,
          data: {
            fromEmail,
            toEmail,
            phone,
            name,
            message
          },
          message: "Contact mail sent successfully 🎉👮‍♂️ ...",
        }, { status: 200 });
      }
    );

    return NextResponse.json({
      status: true,
      data: {
        fromEmail,
        toEmail,
        phone,
        name,
        message
      },
      message: "Contact mail sent successfully 🎉 ...",
    }, { status: 200 });
  } catch (error: any) {
    console.error("Error in sending contact eMAIL: ", error.message);
    return NextResponse.json({
      status: false,
      error: error,
      message: "Internal server error occurred ⚠👮‍♂️..",
    }, { status: 500 });
  }
}