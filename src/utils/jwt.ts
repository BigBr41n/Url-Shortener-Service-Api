import jwt from "jsonwebtoken";
import logger from "./logger";
import { HttpError } from "../models/CustomError";

export function signJwt(object: Object): string | null {
  const jwtSecret = process.env.JWT_SECRET?.toString();

  try {
    if (!jwtSecret) {
      logger.error("JWT secret not set");
      return null;
    }

    const token = jwt.sign({ object }, jwtSecret, { expiresIn: "72h" });

    return token;
  } catch (error) {
    logger.error(error);
    return null;
  }
}
