import { Request, Response } from "express";
import * as subscriptionService from "./subscription.service";
import { prisma } from "../../config/prisma";
import { ensureStripeCustomerForUser } from "../../core/middleware/ensureStripeCustomerForUser";

export const getSubscriptionPlans = async (req: Request, res: Response) => {
  try {
    const result = await subscriptionService.getSubscriptionPlans();
    res.status(result.status).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getUserSubscriptions = async (req: Request, res: Response) => {
  try {
    const result = await subscriptionService.getUserSubscriptions(req.user.id);
    res.status(result.status).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getInstructorSubscriptions = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await subscriptionService.getInstructorSubscriptions(
      req.user.id
    );
    res.status(result.status).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const subscribeUser = async (req: Request, res: Response) => {
  try {
    const { planId, stripeSubscriptionId } = req.body;

    // Always ensure StripeCustomer exists for the user (and created on Stripe if missing)
    const stripeCustomerId = await ensureStripeCustomerForUser(
      req.user.id,
      req.user.email
    );

    // Now call service with the in-sync stripeCustomerId
    const result = await subscriptionService.subscribeUser(req.user.id, {
      planId,
      stripeSubscriptionId,
      stripeCustomerId,
    });

    res.status(result.status).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const subscribeInstructor = async (req: Request, res: Response) => {
  try {
    const { planId, stripeSubscriptionId } = req.body;

    // Always ensure StripeCustomer exists for the user (and created on Stripe if missing)
    const stripeCustomerId = await ensureStripeCustomerForUser(
      req.user.id,
      req.user.email
    );

    const result = await subscriptionService.subscribeInstructor(req.user.id, {
      planId,
      stripeSubscriptionId,
      stripeCustomerId,
    });
    res.status(result.status).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const cancelUserSubscription = async (req: Request, res: Response) => {
  try {
    const result = await subscriptionService.cancelUserSubscription(
      req.user.id
    );
    res.status(result.status).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const cancelInstructorSubscription = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await subscriptionService.cancelInstructorSubscription(
      req.user.id
    );
    res.status(result.status).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
