import { Request, Response } from 'express';
import * as profileService from './profile.service';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await profileService.getAllUsers();
    res.status(result.status).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Internal Server Error'
    });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const result = await profileService.getUserById(userId);
    res.status(result.status).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Internal Server Error'
    });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const userData = req.body;
    
    const result = await profileService.updateUser(userId, userData);
    res.status(result.status).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Internal Server Error'
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const result = await profileService.deleteUser(userId);
    res.status(result.status).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Internal Server Error'
    });
  }
};

export const changeUserRole = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    
    const result = await profileService.changeUserRole(userId, role);
    res.status(result.status).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Internal Server Error'
    });
  }
};

export const getUserStats = async (req: Request, res: Response) => {
  try {
    const result = await profileService.getUserStats();
    res.status(result.status).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Internal Server Error'
    });
  }
};