import { NextFunction, Request, Response } from "express";
import { HttpError } from "../models/CustomError";
import {
  uploadAvatar,
  updateUser,
  deleteUserService,
} from "../services/user.service";
import logger from "../utils/logger";

interface JWT_RESULT {
  id: string;
}

interface AuthenticatedRequest extends Request {
  userData?: JWT_RESULT;
}

interface RequestBody {
  username?: string;
  email?: string;
  company?: {
    name: string;
    professionalEmail: string;
  };
}

function verify(body: RequestBody) {
  const { username, email, company } = body;
  if (!username || !email || !company) {
    return false;
  }
  return true;
}

export const addAvatarController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.file) {
    throw new HttpError("please provide an image", 400);
  }

  try {
    uploadAvatar(
      req.userData,
      req.file.filename,
      (err: HttpError | null, result: string | null) => {
        if (err) {
          throw new HttpError(err.message, 500);
        }
        res.status(200).json({
          message: "Avatar uploaded successfully",
          filename: result,
        });
      }
    );
  } catch (error) {
    console.error("Error uploading avatar:", error);
    next(error);
  }
};

export const updateController = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!verify(req.body)) {
      throw new HttpError("please fill in all required fields", 400);
    }

    updateUser(
      req.userData,
      req.body,
      (err: HttpError | null, result: any | null) => {
        if (err) {
          throw new HttpError(err.message, err.code);
        }
        res.status(200).json({
          message: "User updated successfully",
          data: result,
        });
      }
    );
  } catch (error) {
    logger.error("Error updating user:", error);
    next(error);
  }
};

export const deleteUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    deleteUserService(req.userData, (err: HttpError | null) => {
      if (err) {
        throw new HttpError(err.message, err.code);
      }
      res.status(200).json({
        message: "User deleted successfully",
      });
    });
  } catch (error) {
    logger.error("Error deleting user:", error);
    next(error);
  }
};
