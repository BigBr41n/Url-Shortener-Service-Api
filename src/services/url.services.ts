import { HttpError } from "../models/CustomError";
import Url from "../models/shortUrl.model";
import User from "../models/user.model";
import logger from "../utils/logger";
import axios from "axios";
import QRcode from "qrcode";

interface JWT_RESULT {
  id: string;
}

export type ERROR_TO_RETURN = HttpError | null | undefined;

interface Url {
  url: string;
  aliasProvided?: string;
}

export interface ShortedUrl {
  id: string;
  originalUrl: string;
  alias: string;
  totalClicks: number;
  referer: string;
  regions: [
    {
      name: string;
      clicks: number;
    }
  ];
  createdAt: Date;
  updatedAt: Date;
}

const generateUniqueAlias = async () => {
  let alias;
  let length = Math.floor(Math.random() * (14 - 8 + 1)) + 8;
  do {
    alias = (await import("nanoid")).nanoid(length);
    // Check if the generated short URL already exists
    var existingUrl = await Url.findOne({ alias });
  } while (existingUrl);
  return alias;
};

export const createShortUrlService = async (
  userId: JWT_RESULT,
  url: Url,
  cb: (err: ERROR_TO_RETURN, result: ShortedUrl | null) => void
) => {
  try {
    // Find the user
    const user = await User.findById(userId?.id);
    if (!user) throw new HttpError("User Not Found !", 404);

    logger.info("first print");
    logger.info(user);

    // Generate unique short URL
    let shortUrl;
    if (url.aliasProvided) {
      logger.info("alias provided");
      logger.info(url.aliasProvided);
      // Check if the provided alias already exists
      const existingUrl = await Url.findOne({ alias: url.aliasProvided });
      if (existingUrl) {
        // Alias already exists, generate a unique short URL
        throw new HttpError(
          `Alias "${url.aliasProvided}" is already taken`,
          409
        );
      } else {
        logger.info("before creating");
        const newShortedUrl = await Url.create({
          user: user._id,
          originalUrl: url.url,
          alias: url.aliasProvided,
          ShortedUrl: `https://${process.env.DOMAIN}/${url.aliasProvided}`,
        });
        logger.info(newShortedUrl);

        //saving the new shortedUrl id to the users Array
        logger.info(user.shortedUrl);
        user.shortedUrl.push(newShortedUrl._id);
        logger.info(user.shortedUrl);
        await user.save();
        logger.info(user);

        //returning back the new shortedUrl
        return cb(null, newShortedUrl);
      }
    }

    //generating a random alias
    const generatedAlias = await generateUniqueAlias();

    //creating the new shorted url
    const newShortedUrl = await Url.create({
      user: userId.id,
      originalUrl: url.url,
      alias: generatedAlias,
      ShortedUrl: `https://${process.env.DOMAIN}/${generatedAlias}`,
    });

    //saving the new shortedUrl id to the users Array
    user.shortedUrl.push(newShortedUrl._id);
    await user.save();
    cb(null, newShortedUrl);
  } catch (error) {
    logger.error(error);
    if (error instanceof HttpError) return cb(error, null);
    return cb(new HttpError("Internal Server Error", 500), null);
  }
};

export const getOriginalUrlService = async (
  shortedUrl: string,
  ip: string,
  cb: (err: ERROR_TO_RETURN, data: string | null) => void
) => {
  try {
    logger.error("here in the ORIGINS");
    //search for the original
    const originalUrl = await Url.findOne({ alias: shortedUrl });
    if (!originalUrl) throw new HttpError("Url Not Found", 404);

    //incrementing the total clicks
    originalUrl.totalClicks += 1;

    //get the country name using IP
    const response = await axios.get(
      `https://ipinfo.io/${ip}?token=${process.env.IP_TOKEN}`
    );
    const { country } = response.data;

    let countryExists = false;

    //if we didn't find the country
    if (!country) {
      originalUrl.regions.forEach(
        (region: { name: string; clicks: number }) => {
          if (region.name === "Unknown") {
            region.clicks += 1;
            countryExists = true;
            return;
          }
        }
      );
      if (!countryExists)
        originalUrl.regions.push({ name: "Unknown", clicks: 1 });
      await originalUrl.save();
      return cb(null, originalUrl.originalUrl);
    }

    //check if the country already exists in the regions array
    originalUrl.regions.forEach((region: { name: string; clicks: number }) => {
      if (region.name === country) {
        region.clicks += 1;
        countryExists = true;
        return;
      }
    });

    if (!countryExists) originalUrl.regions.push({ name: country, clicks: 1 });

    await originalUrl.save();
    return cb(null, originalUrl.originalUrl);
  } catch (error) {
    logger.error(error);
    if (error instanceof HttpError) return cb(error, null);
    return cb(new HttpError("Internal Server Error", 500), null);
  }
};

export const getShortUrlAnalyticsService = async (
  userId: JWT_RESULT,
  shortCode: string,
  cb: (err: ERROR_TO_RETURN, result: any | null) => void
) => {
  try {
    //find the user
    const user = await User.findById(userId?.id);
    if (!user) throw new HttpError("User Not Found", 404);

    //find the shortUrl
    const shortUrl = await Url.findOne({ alias: shortCode });
    if (!shortUrl) throw new HttpError("Url Not Found", 404);

    //return the analytics
    return cb(null, shortUrl);
  } catch (error) {
    logger.error(error);
    if (error instanceof HttpError) return cb(error, null);
    return cb(new HttpError("Internal Server Error", 500), null);
  }
};

export const updateShortUrlService = async (
  userId: JWT_RESULT,
  shortCode: string,
  body: Url,
  cb: (err: ERROR_TO_RETURN, data: any | null) => void
) => {
  try {
    //find the user
    const user = await User.findById(userId?.id);
    if (!user) throw new HttpError("User Not Found", 404);

    //find the shortUrl
    const shortUrl = await Url.findOne({ alias: shortCode });
    if (!shortUrl) throw new HttpError("Url Not Found", 404);

    if (body.aliasProvided) {
      // Check if the provided alias already exists
      const existingUrl = await Url.findOne({ alias: body.aliasProvided });
      if (existingUrl) {
        // Alias already exists, generate a unique short URL
        throw new HttpError(
          `Alias "${body.aliasProvided}" is already taken`,
          409
        );
      } else {
        shortUrl.alias = body.aliasProvided;
        shortUrl.ShortedUrl = `https://${process.env.DOMAIN}/${body.aliasProvided}`;
        await shortUrl.save();
        return cb(null, shortUrl);
      }
    }

    const alias = await generateUniqueAlias();

    //update the shortUrl
    shortUrl.alias = alias;
    shortUrl.ShortedUrl = `https://${process.env.DOMAIN}/${alias}`;
    await shortUrl.save();
    return cb(null, shortUrl);
  } catch (error) {
    logger.error(error);
    if (error instanceof HttpError) return cb(error, null);
    return cb(new HttpError("Internal Server Error", 500), null);
  }
};

export const deleteShortUrlService = async (
  userId: JWT_RESULT,
  shortCode: string,
  cb: (err: ERROR_TO_RETURN, result: string | null) => void
) => {
  try {
    //find the user
    const user = await User.findById(userId?.id);
    if (!user) throw new HttpError("User Not Found", 404);

    //find the shortUrl
    const shortUrl = await Url.findOne({ alias: shortCode });
    if (!shortUrl) throw new HttpError("Url Not Found", 404);

    //delete the shortUrl
    await user.shortedUrl.remove(shortUrl._id);
    await user.save();

    await shortUrl.remove();
    return cb(null, `${shortCode} Deleted Successfully !`);
  } catch (error) {
    logger.error(error);
    if (error instanceof HttpError) return cb(error, null);
    return cb(new HttpError("Internal Server Error", 500), null);
  }
};

export const listUserShortUrlsService = async (
  userId: JWT_RESULT,
  cb: (err: ERROR_TO_RETURN, result: any) => void
) => {
  try {
    //find the user
    const user = await User.findById(userId?.id);
    if (!user) throw new HttpError("User Not Found", 404);

    //find the shortUrls
    const shortUrls = await Url.find({ user: userId?.id });
    if (!shortUrls) throw new HttpError("Url Not Found", 404);

    return cb(null, shortUrls);
  } catch (error: any) {
    logger.error(error);
    if (error instanceof HttpError) return cb(error, null);
    return cb(new HttpError("Internal Server Error", 500), null);
  }
};

export const generateQRCodeService = async (
  url: string,
  cb: (err: ERROR_TO_RETURN, result: any) => void
) => {
  logger.info("here in the generateQRCodeService");
  try {
    QRcode.toDataURL(url, (err, url) => {
      if (err) throw err;
      return cb(null, url);
    });
  } catch (error) {
    logger.error(error);
    if (error instanceof HttpError) return cb(error, null);
    return cb(new HttpError("Internal Server Error", 500), null);
  }
};
