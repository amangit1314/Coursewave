// controllers/contactController.ts
import { Request, Response } from "express";
import { sendContactMessage } from "./contact.service";


export const handleContact = async (req: Request, res: Response) => {
  try {
    const { fromEmail, name, phone, subject, message } = req.body;
    // send to you, amansoni53453@gmail.com
    await sendContactMessage({
    //   fromEmail,
      name,
      phone,
      subject,
      message,
      toEmail: "gitaman8481@gmail.com",
    });
    res.json({ status: true, message: "Message sent successfully ..." });
  } catch (e) {
    console.error("Contact form failure:", e);
    res.status(500).json({ status: false });
  }
};
