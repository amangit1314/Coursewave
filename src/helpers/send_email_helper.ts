import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import bcryptjs from "bcryptjs";
import { db } from "@/lib/db";
import { forgotPasswordHtmlTemplate } from "./forgot_password_email_html";
import { verifyEmailHtmlTemplate } from "./verify_email_html";

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

// export const sendEmail = (email: string, subject: string, text: string, html: any, successCallback: any) => {
//     const msg = {
//         to: email,
//         from: process.env.EMAIL_ADDRESS,
//         subject: subject,
//         text: text,
//         html: html,
//     };

//     sgMail
//         .send(msg as any)
//         .then(successCallback)
//         .catch((error) => {
//             console.error(error);
//             console.log(error);
//         });
// };

export const sendEmail = async (
  email: string,
  emailType: string,
  userId: string,
  html: any,
  successCallback: any
) => {
  try {
    const hasedToken = await bcryptjs.hash(userId.toString(), 10);

    if (emailType === "VERIFY") {
      await db.user.update({
        where: {
          id: userId,
        },
        data: {
          id: userId,
          verifyToken: hasedToken,
          verifyTokenExpiry: (Date.now() + 3600000).toString(),
          verifyTokenStatus: "VALID",
        },
      });
    } else if (emailType === "RESET") {
      await db.user.update({
        where: {
          id: userId,
        },
        data: {
          id: userId,
          resetToken: hasedToken,
          resetTokenExpiry: (Date.now() + 3600000).toString(),
          resetTokenStatus: "VALID",
        },
      });
    }

    const msg = {
      to: email,
      from: process.env.EMAIL_ADDRESS,
      subject:
        emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html:
        emailType === "VERIFY"
          ? verifyEmailHtmlTemplate
          : forgotPasswordHtmlTemplate,
    };

    sgMail
      .send(msg as any)
      .then(successCallback)
      .catch((error) => {
        console.error(error);
        console.log(error);
      });
  } catch (error) {}
};

export const sendContactEmail = (
  toEmail: string,
  fromEmail: string,
  subject: string,
  text: string,
  html: any,
  successCallback: any
) => {
  const msg = {
    to: "amansoni53453@gmail.com",
    from: process.env.EMAIL_ADDRESS,
    subject: subject,
    text: text,
    html: html,
  };

  sgMail
    .send(msg as any)
    .then(successCallback)
    .catch((error) => {
      console.error(error);
      console.log(error);
    });
};

// **********************************************************

export const sendEmailViaNodemailer = async (
  res: Response,
  email: string,
  subject: string,
  text: string,
  html: any
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  //   const resetPasswordUrl = await generateVerificationToken(email);
  const mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to: email,
    subject: subject,
    text: text,
    html: html,
    //   html: `<p>Hi there,</p>
    //     <p>Please click the link below to reset your password:</p>
    //     <a href=${resetPasswordUrl}">${resetPasswordUrl}</a>
    //     <p>If you did not request a password reset, you can safely ignore this email.</p>
    //     <p>Thank you,</p>
    //     <p>The Moonbase Team</p>`,
  };
  transporter.sendMail(mailOptions, (err: any) => {
    if (err) {
      console.log(err);
    } else {
      // res.status(200).json({ message: "Email sent successfully" });
      console.log("mail send successfully");
    }
  });
};

const sampleHtmlTemplate = (verificationToken: string) => {
  const htmlTemplate = `
<p> 
    <a>Hey, Aman!</a>
    <br /> <br/>

    <a style="margin-top:8px;" className="mt-4">Thank you for joining <span  className="text-blue-500 font-semibold tracking-tight">Coursewave</span>! To activate your account and start exploring, please click the verification link below:</a>
    <a style="color:DodgerBlue;" href="${verificationToken}" className="flex cursor-pointer hover:bg-blue-600 hover:text-white justify-center items-center px-4 py-2 bg-blue-400 text-blue-700"> Verify My Account</a>
    <br/>
    <br />

    <a style="margin-top:8px;" className="mt-4">Best Regards</a>
    <br />
    <br/>
    <a>Aman Soni</a>
</p>
`;
  return htmlTemplate;
};
