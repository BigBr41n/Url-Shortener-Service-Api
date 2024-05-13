import { Request, Response, NextFunction } from "express";
import { HttpError } from "../models/CustomError";
import jwt, { VerifyErrors, JsonWebTokenError } from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
  userData?: Object;
}

export const checkAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies["jwt"];
  const secret = process.env.JWT_SECRET?.toString();

  if (!token || !secret) {
    next(
      new HttpError(
        "Authentication failed, Missing Token or Internal Server Error",
        401
      )
    );
  } else {
    jwt.verify(
      token,
      secret,
      (error: VerifyErrors | null, decoded: any | undefined) => {
        if (error instanceof JsonWebTokenError) {
          next(new HttpError("Authentication failed", 401));
        } else {
          req.userData = decoded;
          next();
        }
      }
    );
  }
};
