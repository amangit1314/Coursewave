import axios from "axios";
import apiManager from "../api-manager";
import ApiManager from "../api-manager";

export type ContactFormPayload = {
  fromEmail: string;
  name: string;
  phone: string;
  subject: string;
  message: string;
};

export async function sendContactMessage(payload: ContactFormPayload) {
  // Hard-coded destination: amansoni53453@gmail.com
  return ApiManager.getInstance().post("/contact", {
    ...payload,
    toEmail: "amansoni53453@gmail.com",
  });
}
