import { Request, Response } from "express";
import * as userService from "./users.service";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await userService.getAllUsers(req.user?.id || "");
    res.status(result.status).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Internal Server Error",
    });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const result = await userService.getUserById(
      req.params.userId,
      req.user?.id || ""
    );
    res.status(result.status).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Internal Server Error",
    });
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const result = await userService.getUserProfile(req.user?.id || "");
    res.status(result.status).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Internal Server Error",
    });
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const result = await userService.updateUserProfile(
      req.user?.id || "",
      req.body
    );
    res.status(result.status).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Internal Server Error",
    });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const result = await userService.changePassword(
      req.user?.id || "",
      req.body
    );
    res.status(result.status).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Internal Server Error",
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.deleteUser(
      req.params.userId,
      req.user?.id || ""
    );
    res.status(result.status).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Internal Server Error",
    });
  }
};

export const deleteSelf = async (req: Request, res: Response) => {
  try {
    const result = await userService.deleteSelf(req.user?.id || "");
    res.status(result.status).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Internal Server Error",
    });
  }
};

export const getUserArticles = async (req: Request, res: Response) => {
  try {
    const result = await userService.getUserArticles(req.user?.id || "");
    res.status(result.status).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Internal Server Error",
    });
  }
};

export const getSavedArticles = async (req: Request, res: Response) => {
  try {
    const result = await userService.getSavedArticles(req.user?.id || "");
    res.status(result.status).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Internal Server Error",
    });
  }
};

export const saveArticle = async (req: Request, res: Response) => {
  try {
    const result = await userService.saveArticle(
      req.user?.id || "",
      req.params.articleId
    );
    res.status(result.status).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Internal Server Error",
    });
  }
};

export const unsaveArticle = async (req: Request, res: Response) => {
  try {
    const result = await userService.unsaveArticle(
      req.user?.id || "",
      req.params.articleId
    );
    res.status(result.status).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Internal Server Error",
    });
  }
};

export const checkArticleSaved = async (req: Request, res: Response) => {
  try {
    const result = await userService.checkArticleSaved(
      req.user?.id || "",
      req.params.articleId
    );
    res.status(result.status).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Internal Server Error",
    });
  }
};

export const getUserEnrollments = async (req: Request, res: Response) => {
  try {
    const result = await userService.getUserEnrollments(req.user?.id || "");
    res.status(result.status).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Internal Server Error",
    });
  }
};

export const checkEnrollment = async (req: Request, res: Response) => {
  try {
    const result = await userService.checkEnrollment(
      req.user?.id || "",
      req.params.courseId
    );
    res.status(result.status).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Internal Server Error",
    });
  }
};
