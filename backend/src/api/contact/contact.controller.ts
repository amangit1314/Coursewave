import { Request, Response } from "express";
import { sendContactMessage } from "./contact.service";
import { asyncHandler, sendSuccess } from "../../core/middleware/errorHandler";

export const handleContact = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, phone, subject, message } = req.body;

    await sendContactMessage({
      name,
      phone,
      subject,
      message,
      toEmail: "gitaman8481@gmail.com",
    });

    sendSuccess(res, null, "Message sent successfully");
  }
);
