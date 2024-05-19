import { Request, Response, NextFunction } from "express";
import * as redis from "redis";
import { HttpError } from "../models/CustomError";
import logger from "../utils/logger";

export const redisClient = redis.createClient({
  url: "redis://127.0.0.1:6379",
});

export const cacheMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const key = req.originalUrl;
  const data = await redisClient.get(key).catch((err) => {
    logger.info(err);
    next(new HttpError("Internal server Error", 500));
  });

  if (data !== null) {
    res.status(200).send(JSON.stringify(data));
  }
  next();
};
