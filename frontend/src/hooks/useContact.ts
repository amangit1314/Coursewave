import { useMutation } from "@tanstack/react-query";
import { sendContactMessage, ContactFormPayload } from "@/lib/api/services/contactService";
import toast from "react-hot-toast";

export function useContact() {
  return useMutation({
    mutationFn: (payload: ContactFormPayload) => sendContactMessage(payload),
    onSuccess: () => {
      toast.success("Message sent successfully! We'll get back to you soon.");
    },
    onError: (err) => {
      console.log("ERROR while contact: ", JSON.stringify(err));
      toast.error("Something went wrong. Please try again later.");
    }
  });
}
