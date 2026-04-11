// routes/contact.ts
import express from "express";
import {
  handleContact,
  submitFeedback,
  submitFeatureRequest,
} from "./contact.controller";

const router = express.Router();

router.post("/", handleContact);
router.post("/feedback", submitFeedback);
router.post("/feature-request", submitFeatureRequest);

export default router;
