import { Response, Request, NextFunction } from "express";
import { AnyZodObject } from "zod";
import { HttpError } from "../models/CustomError";

const validate =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error: any) {
      next(new HttpError(error.message, 400));
    }
  };

export default validate;
