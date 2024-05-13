import express, { NextFunction, Request, Response } from "express";
import { HttpError } from "../models/CustomError";
import { createUser, loginUser } from "../services/user.service";

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

// name   : register
// method : POST
// route  : api/v1/auth/register
// status  : UNPROTECTED
export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    verify(req.body, "register");
    await createUser(req.body, (err: HttpError | null, data: any | null) => {
      if (err) {
        throw new HttpError(err.message, err.code);
      }
      res.status(201).json({
        message: "User created successfully",
        data,
      });
    });
  } catch (error) {
    console.error("Error registering user:", error);
    next(error);
  }
};

// name   : login
// method : POST
// route  : api/v1/auth/login
// status  : UNPROTECTED
export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    verify(req.body, "login");
    loginUser(req.body, (err: HttpError | null, data: string | null) => {
      if (err) {
        throw new HttpError(err.message, err.code);
      }
      res.cookie("jwt", data);
      res.status(200).json({
        message: "User logged in successfully",
      });
    });
  } catch (error) {
    console.error("Error login user:", error);
    next(error);
  }
};

// name   : logout
// method : GET
// route  : api/v1/auth/logout
// status  : UNPROTECTED
export async function logoutController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Clear the JWT token stored on the client-side
  res.clearCookie("jwt");
  res.status(200).json({ message: "Logout successful" });
}
