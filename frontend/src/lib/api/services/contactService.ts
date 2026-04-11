import ApiManager from "../api-manager";

export type ContactFormPayload = {
  fromEmail: string;
  name: string;
  phone: string;
  subject: string;
  message: string;
};

export type FeedbackPayload = {
  name: string;
  email: string;
  type: string;
  rating: number;
  message: string;
};

export type FeatureRequestPayload = {
  name: string;
  email: string;
  title: string;
  category: string;
  description: string;
  priority: string;
};

export async function sendContactMessage(payload: ContactFormPayload) {
  // Hard-coded destination: amansoni53453@gmail.com
  return ApiManager.getInstance().post("/contact", {
    ...payload,
    toEmail: "amansoni53453@gmail.com",
  });
}

export async function submitFeedback(payload: FeedbackPayload) {
  return ApiManager.getInstance().post("/contact/feedback", payload);
}

export async function submitFeatureRequest(payload: FeatureRequestPayload) {
  return ApiManager.getInstance().post("/contact/feature-request", payload);
}
