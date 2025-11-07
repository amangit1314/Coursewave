// routes/contact.ts
import express from "express";
import { handleContact } from "./contact.controller";

const router = express.Router();

router.post("/", handleContact);

export default router;
