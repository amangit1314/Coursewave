import { Request, Response } from "express";
import * as subscriptionService from "./subscription.service";

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
    const result = await subscriptionService.subscribeUser(
      req.user.id,
      req.body
    );
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
    const result = await subscriptionService.subscribeInstructor(
      req.user.id,
      req.body
    );
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
