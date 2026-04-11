import { useMutation } from "@tanstack/react-query";
import {
  submitFeedback,
  submitFeatureRequest,
  FeedbackPayload,
  FeatureRequestPayload,
} from "@/lib/api/services/contactService";
import toast from "react-hot-toast";

export function useSubmitFeedback() {
  return useMutation({
    mutationFn: (payload: FeedbackPayload) => submitFeedback(payload),
    onSuccess: () => {
      toast.success("Feedback submitted successfully! Thank you.");
    },
    onError: (err) => {
      console.error("ERROR while submitting feedback:", err);
      toast.error("Something went wrong. Please try again later.");
    },
  });
}

export function useSubmitFeatureRequest() {
  return useMutation({
    mutationFn: (payload: FeatureRequestPayload) =>
      submitFeatureRequest(payload),
    onSuccess: () => {
      toast.success("Feature request submitted successfully! Thank you.");
    },
    onError: (err) => {
      console.error("ERROR while submitting feature request:", err);
      toast.error("Something went wrong. Please try again later.");
    },
  });
}
