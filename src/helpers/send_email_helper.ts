import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export const sendEmail = (email: string, subject: string, text: string, html: any, successCallback: any) => {
    const msg = {
        to: email,
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

export const sendEmailViaNodemailer = async (res: Response,email: string, subject: string, text: string, html: any) => {
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
