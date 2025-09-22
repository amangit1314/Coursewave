import { Request, Response } from "express";
import * as SecureAuthService from "./secure-auth.service";

export const register = (req: Request, res: Response) =>
  SecureAuthService.register(req, res);

export const login = (req: Request, res: Response) =>
  SecureAuthService.login(req, res);

export const forgotPassword = (req: Request, res: Response) =>
  SecureAuthService.forgotPassword(req, res);

export const resetPassword = (req: Request, res: Response) =>
  SecureAuthService.resetPassword(req, res);

export const verifyEmail = (req: Request, res: Response) =>
  SecureAuthService.verifyEmail(req, res);

export const resendVerification = (req: Request, res: Response) =>
  SecureAuthService.resendVerification(req, res);

export const refreshToken = (req: Request, res: Response) =>
  SecureAuthService.refreshToken(req, res);

export const logout = (req: Request, res: Response) =>
  SecureAuthService.logout(req, res);

export const getMe = (req: Request, res: Response) =>
  SecureAuthService.getMe(req, res);
