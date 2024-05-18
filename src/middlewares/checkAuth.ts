import { Request, Response, NextFunction } from "express";
import { HttpError } from "../models/CustomError";
import { verifyJwt } from "../utils/jwt";

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
    const result = verifyJwt(token);
    if (result.expired) next(new HttpError("Expired token", 403));
    if (result.valid) {
      req.userData = result.decoded;
      next();
    }
  }
};
