// import { Request, Response } from "express";
// import * as stripeService from "./stripe.service";

// export const handleStripeWebhook = async (req: Request, res: Response) => {
//   try {
//     const result = await stripeService.handleWebhookEvent(req.body, req.headers["stripe-signature"] as string);
//     res.status(result.status).json(result.data);
//   } catch (error: any) {
//     console.error("Webhook processing failed:", error.message);
//     res.status(500).json({
//       success: false,
//       error: error.message,
//       message: "Webhook processing failed"
//     });
//   }
// };


import { Request, Response } from "express";
import * as stripeService from "./stripe.service";

export const handleStripeWebhook = async (req: Request, res: Response) => {
  try {
    console.log("[WEBHOOK] Headers:", req.headers);
    console.log("[WEBHOOK] Raw Body:", req.body);

    const signature = req.headers["stripe-signature"] as string;
    const result = await stripeService.handleWebhookEvent(req.body, signature);

    console.log("[WEBHOOK] Service Result:", result);

    res.status(result.status).json(result.data);
  } catch (error: any) {
    console.error("[WEBHOOK ERROR] Processing failed:", error.stack || error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Webhook processing failed"
    });
  }
};
