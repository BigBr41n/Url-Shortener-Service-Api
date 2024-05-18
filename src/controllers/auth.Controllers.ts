import express, { NextFunction, Request, Response } from "express";
import { HttpError } from "../models/CustomError";
import logger from "../utils/logger";
import {
  createUser,
  loginUser,
  activateAccountService,
  changePasswordService,
  refreshTokenService,
} from "../services/user.service";
import { ERROR_TO_RETURN } from "../services/url.services";

interface AuthenticatedRequest extends Request {
  userData?: { id: string };
}

interface JWT_RESULT {
  id: string;
}

//Data that should be received in the body
interface ReqBody {
  username?: string;
  email?: string;
  password?: string;
  company?: {
    name?: string;
    professionalEmail?: string;
  };
  userData?: {
    username?: string;
    email?: string;
  };
}

//verify if the body has the required parameters
//even i did a input validation using zod as a middleware and created the schema for each route
const verify = (body: ReqBody, usage: string): boolean => {
  if (usage === "register") {
    const { username, email, password, company } = body;
    if (!username || !email || !password || !company) {
      return false;
    }
  } else {
    const { userData, username, email } = body;
    if (!userData || !username || !email) {
      return false;
    }
  }
  return true;
};

// description   : register a new user
// method        : POST
// route         : api/v1/auth/register
// status        : UNPROTECTED
export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!verify(req.body, "register"))
      throw new HttpError("please fill in all required fields", 400);
    await createUser(req.body, (err: HttpError | null, data: any | null) => {
      if (err) {
        throw new HttpError(err.message, err.code);
      }
      res.status(201).json({
        message: data,
      });
    });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

// description   : activate account after registration
// method        : GET
// route         : api/v1/auth/activate
// status        : UNPROTECTED
export const activateAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.query as { token: string };
    if (!token) throw new HttpError("No Token", 400);

    activateAccountService(
      token,
      (err: HttpError | null, result: string | null) => {
        if (err) {
          throw new HttpError(err.message, err.code);
        }
        res.status(200).json({
          message: result,
        });
      }
    );
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

// description   : login the registered user
// method        : POST
// route         : api/v1/auth/login
// status        : UNPROTECTED

interface Tokens {
  token: string;
  refreshToken: string;
}
export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    verify(req.body, "login");
    loginUser(req.body, (err: HttpError | null, data: Tokens | null) => {
      if (err) {
        throw new HttpError(err.message, err.code);
      }
      res.cookie("jwt", data!.token);
      res.status(200).json({
        message: "User logged in successfully",
        token: data!.token,
        refreshToken: data!.refreshToken,
      });
    });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

// description   : logout
// method        : GET
// route         : api/v1/auth/logout
// status        : UNPROTECTED
export async function logoutController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Clear the JWT token stored on the client-side
  res.clearCookie("jwt");
  res.status(200).json({ message: "Logout successful" });
}

interface data {
  oldPass: string;
  newPass: string;
}

export const changePasswordController = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const data: data = {
      oldPass: req.body.oldPassword,
      newPass: req.body.password,
    };

    changePasswordService(
      req.userData,
      data,
      (err: HttpError | null | undefined, result: any) => {
        if (err) {
          throw new HttpError(err.message, err.code);
        }
        res.status(200).json({
          message: result,
        });
      }
    );
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

export const refreshTokenController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) throw new HttpError("No Token", 400);

    refreshTokenService(
      refreshToken,
      (err: ERROR_TO_RETURN, accessToken: string | null) => {
        if (err) {
          throw new HttpError(err.message, err.code);
        }
        res.status(200).json({
          accessToken,
        });
      }
    );
  } catch (error) {
    logger.error(error);
    next(error);
  }
};
