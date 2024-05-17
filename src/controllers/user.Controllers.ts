import { NextFunction, Request, Response } from "express";
import { HttpError } from "../models/CustomError";
import {
  uploadAvatar,
  updateUser,
  deleteUserService,
  getUserService,
  forgotPasswordService,
} from "../services/user.service";
import logger from "../utils/logger";
import { ERROR_TO_RETURN } from "../services/url.services";

//the coming request should have a user id the decoded using jwt verify function
interface AuthenticatedRequest extends Request {
  userData?: { id: string };
}

//data coming in request body
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

// description   : upload an avatar to the user profile
// method        : POST
// route         : api/v1/user/upload-avatar/:id
// status        : PROTECTED
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

// description   : update the user information
// method        : PATCH
// route         : api/v1/user/update  (//no need to pass the id here because the user should be logged in)
// status        : PROTECTED
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

// description   : delete the user account
// method        : DELETE
// route         : api/v1/user/delete
// status        : PROTECTED
export const deleteUserController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const password = req.body.password;
    deleteUserService(req.userData, password, (err: HttpError | null) => {
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

// description   : GET THE USER PROFILE
// method        : GET
// route         : api/v1/user/:id
// status        : UNPROTECTED
export const getUserController = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    getUserService(req.params.id, (err: HttpError | null, userData: any) => {
      if (err) {
        throw new HttpError(err.message, err.code);
      }
      res.status(200).json({
        message: "User fetched successfully",
        data: userData,
      });
    });
  } catch (error: any) {
    logger.error("Error getting user:", error);
    next(new HttpError(error.message, error.code || 500));
  }
};

// description   : to reset password if the user is not logged in
// method        : POST
// route         : api/v1/auth/forgot-password
// status        : UNPROTECTED
export const forgotPasswordController = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;
    if (!email) {
      throw new HttpError("Please provide an email", 400);
    }

    forgotPasswordService(email, (err: ERROR_TO_RETURN, result: any) => {
      if (err) {
        throw new HttpError(err.message, err.code);
      }
      res.status(200).json({
        message: "Please check your email for further instructions",
      });
    });
  } catch (error: any) {
    logger.error("Error getting user:", error);
    next(new HttpError(error.message, error.code || 500));
  }
};
