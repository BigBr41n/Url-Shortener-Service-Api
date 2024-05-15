import { Request, Response, NextFunction } from "express";
import { HttpError } from "../models/CustomError";
import logger from "../utils/logger";
import {
  createShortUrlService,
  getOriginalUrlService,
  updateShortUrlService,
  deleteShortUrlService,
  generateQRCodeService,
  listUserShortUrlsService,
  getShortUrlAnalyticsService,
} from "../services/url.services";
import { ShortedUrl } from "../services/url.services"; //importing the interface to avoid redundancy
import { ERROR_TO_RETURN } from "../services/url.services"; //importing the error model to be returned

interface AuthenticatedRequest extends Request {
  userData?: { id: string };
}

// Controller to create a short URL for a given long URL
export const createShortUrlController = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userData } = req;
    createShortUrlService(
      userData!,
      req.body,
      (err: ERROR_TO_RETURN, result: ShortedUrl | null) => {
        if (err) {
          throw new HttpError(err.message, err.code);
        }
        res.status(201).json({
          message: "Short URL created successfully",
          data: result,
        });
      }
    );
  } catch (error) {
    logger.error(error);
    if (error instanceof HttpError) next(error);
    next(new HttpError("Internal Server Error ", 500));
  }
};

// Controller to handle requests to a short URL and redirect users to the original long URL
export const redirectController = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const ip = (req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress) as string;

    getOriginalUrlService(
      req.params.shortCode,
      ip,
      (err: ERROR_TO_RETURN, data: string | null) => {
        if (err) {
          throw new HttpError(err.message, err.code);
        }
        res.status(200).send(data);
        //res.redirect(data)
      }
    );
  } catch (error) {
    logger.error(error);
    if (error instanceof HttpError) next(error);
    next(new HttpError("Internal Server Error ", 500));
  }
};

// Controller to retrieve analytics data for a specific short URL
export const getShortUrlAnalyticsController = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { shortCode } = req.params;
    const { userData } = req;

    getShortUrlAnalyticsService(
      userData!,
      shortCode,
      (err: ERROR_TO_RETURN, result: ShortedUrl | null) => {
        if (err) {
          throw new HttpError(err.message, err.code);
        }
        res.status(200).json({
          message: "Short URL analytics retrieved successfully",
          data: result,
        });
      }
    );
  } catch (error) {
    logger.error(error);
    if (error instanceof HttpError) next(error);
    next(new HttpError("Internal Server Error ", 500));
  }
};

// Controller to update properties of a short URL
export const updateShortUrlController = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { shortCode } = req.params;
    const { userData } = req;

    updateShortUrlService(
      userData!,
      shortCode,
      req.body,
      (err: ERROR_TO_RETURN, result: ShortedUrl | null) => {
        if (err) {
          throw new HttpError(err.message, err.code);
        }
        res.status(200).json({
          message: "Short URL updated successfully",
          data: result,
        });
      }
    );
  } catch (error) {
    logger.error(error);
    if (error instanceof HttpError) next(error);
    next(new HttpError("Internal Server Error ", 500));
  }
};

// Controller to delete a short URL
export const deleteShortUrlController = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { shortCode } = req.params;
    const { userData } = req;

    deleteShortUrlService(
      userData!,
      shortCode,
      (err: ERROR_TO_RETURN, result: string | null) => {
        if (err) {
          throw new HttpError(err.message, err.code);
        }
        res.status(200).json({
          message: "Short URL deleted successfully",
          data: result,
        });
      }
    );
  } catch (error) {
    logger.error(error);
    if (error instanceof HttpError) next(error);
    next(new HttpError("Internal Server Error ", 500));
  }
};

// Controller to retrieve a list of short URLs created by the authenticated user
export const listUserShortUrlsController = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userData } = req;

    listUserShortUrlsService(userData!, (err: ERROR_TO_RETURN, result: any) => {
      if (err) {
        throw new HttpError(err.message, err.code);
      }
      res.status(200).json({
        message: "Short URLs retrieved successfully",
        data: result,
      });
    });
  } catch (error) {
    logger.error(error);
    if (error instanceof HttpError) next(error);
    next(new HttpError("Internal Server Error ", 500));
  }
};

// Controller to generate a QR code for a short URL
export const generateQRCodeController = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const url = req.query?.url as string;
    logger.info(url);
    if (!url) {
      throw new HttpError("URL is required", 400);
    }

    generateQRCodeService(
      url,
      (err: ERROR_TO_RETURN, result: string | null) => {
        if (err) {
          throw new HttpError(err.message, err.code);
        }
        res.status(200).json({
          message: "QR code generated successfully",
          data: result,
        });
      }
    );
  } catch (error) {
    logger.error(error);
    if (error instanceof HttpError) next(error);
    next(new HttpError("Internal Server Error ", 500));
  }
};
