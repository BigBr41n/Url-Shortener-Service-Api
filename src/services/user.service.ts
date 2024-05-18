import bcrypt from "bcrypt";
import User from "../models/user.model";
import Url from "../models/shortUrl.model";
import { HttpError } from "../models/CustomError";
import logger from "../utils/logger";
import { signJwt } from "../utils/jwt";
import mailer from "../utils/mailer";
import crypto from "crypto";
import { ERROR_TO_RETURN } from "./url.services";
import { AnyExpression } from "mongoose";

interface UserData {
  username: string;
  email: string;
  password: string;
  company: {
    name: string;
    professionalEmail: string;
  };
}

interface JWT_RESULT {
  id: string;
}

export async function createUser(
  userData: UserData,
  cb: (error: HttpError | null, user: string | UserData | null) => void
) {
  const { username, email, password: ReqPass, company } = userData;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new HttpError("This Email Already Exists", 401);
    }

    const hashedPassword = await bcrypt.hash(ReqPass, 10);

    // Generate a strong random token using crypto
    const activationToken = crypto.randomBytes(32).toString("hex");

    //expiration
    const activeExpires = Date.now() + 1000 * 60 * 60; // 1h

    // Create new user with inactive status and activation token
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      isActive: false,
      activationToken,
      company,
      activeExpires,
    });

    await newUser.save();

    // Send activation email
    await mailer(email, username, activationToken);
    logger.info("out");
    cb(null, "success , now please activate your email , 1h in your hands");
  } catch (error: any) {
    logger.error(error);
    if (error instanceof HttpError) return cb(error, null);
    return cb(new HttpError("Internal server error", error.code || 500), null);
  }
}

//login user service
export async function loginUser(
  data: UserData,
  cb: (err: HttpError | null, data: string | null) => void
) {
  try {
    const { email, password } = data;
    const user = await User.findOne({ email });
    if (!user) {
      throw new HttpError("Invalid email or password", 401);
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new HttpError("Invalid email or password", 401);
    }
    const token = signJwt({ id: user._id });
    if (token === null) {
      throw new HttpError("Internal server error", 500);
    }

    cb(null, token);
  } catch (error: any) {
    logger.error(error);
    if (error instanceof HttpError) return cb(error, null);
    return cb(new HttpError("Internal server error", error.code || 500), null);
  }
}

export const uploadAvatar = async (
  userId: JWT_RESULT | undefined,
  filename: string,
  cb: (err: HttpError | null, result: string | null) => void
) => {
  try {
    if (userId === undefined) {
      throw new HttpError("INVALID TOKEN", 404);
    } else {
      const user = await User.findById(userId.id);
      if (!user) {
        throw new HttpError("User not found", 404);
      }
      user.avatar = `/avatar/${filename}`;
      await user.save();
      cb(null, "success");
    }
  } catch (error: any) {
    logger.error(error);
    if (error instanceof HttpError) return cb(error, null);
    return cb(new HttpError("Internal server error", error.code || 500), null);
  }
};

export const updateUser = async (
  userId: JWT_RESULT | undefined,
  userData: any,
  cb: (err: HttpError | null, result: any | null) => void
) => {
  try {
    const user = await User.findById(userId?.id);
    if (!user) {
      throw new HttpError("User not found", 404);
    }

    user.username = userData.username;
    user.email = userData.email;
    user.company.name = userData.company.name;
    user.company.professionalEmail = userData.company.professionalEmail;
    await user.save();

    //omit the password field
    const { password, ...userWOPassword } = user._doc;

    cb(null, userWOPassword);
  } catch (error: any) {
    logger.error(error);
    if (error instanceof HttpError) return cb(error, null);
    return cb(new HttpError("Internal server error", error.code || 500), null);
  }
};

export const deleteUserService = async (
  userId: JWT_RESULT | undefined,
  password: string,
  cb: (err: HttpError | null) => void
) => {
  try {
    if (!userId?.id === undefined) {
      throw new HttpError("Invalid user ID", 400);
    }

    const user = await User.findById(userId?.id);
    if (!user) {
      throw new HttpError("User not found", 404);
    }

    const isMatch = bcrypt.compare(password, user.password);

    if (!isMatch) throw new HttpError("Invalid password", 400);

    for (const element of user.shortedUrl) {
      await Url.findByIdAndDelete(element);
    }

    cb(null);
  } catch (error: any) {
    logger.error(error);
    if (error instanceof HttpError) return cb(error);
    return cb(new HttpError("Internal server error", error.code || 500));
  }
};

export const getUserService = async (
  userID: string,
  cb: (err: HttpError | null, userData: any) => void
) => {
  try {
    const user = await User.findById(userID);
    if (!user) {
      throw new HttpError("User not found", 404);
    }
    //remove password
    const { password: string, ...cleanUser } = user._doc;
    cb(null, cleanUser);
  } catch (error: any) {
    logger.error(error);
    if (error instanceof HttpError) return cb(error, null);
    return cb(new HttpError("Internal server error", error.code || 500), null);
  }
};

export const activateAccountService = async (
  token: string,
  cb: (err: HttpError | null, result: any) => void
) => {
  try {
    logger.info(token);
    const user = await User.findOne({
      activationToken: token,
      activeExpires: { $gt: Date.now() },
    });
    if (!user) throw new HttpError("Invalid or Expired Token", 400);

    user.active = true;
    await user.save();
    cb(null, "Your account has been successfully activated!");
  } catch (error: any) {
    logger.error(error);
    if (error instanceof HttpError) return cb(error, null);
    return cb(new HttpError("Internal server error", error.code || 500), null);
  }
};

export const forgotPasswordService = async (
  email: string,
  cb: (err: ERROR_TO_RETURN, result: any) => void
) => {
  try {
    const user = await User.findOne({ email });
    if (!user) throw new HttpError("Invalid Email!", 200);

    // Generate a strong random token using crypto
    const changePassToken = crypto.randomBytes(32).toString("hex");

    //expiration
    const changePassTokenExpires = Date.now() + 1000 * 60 * 60; // 1h

    user.changePassToken = changePassToken;
    user.changePassTokenExpires = changePassTokenExpires;

    user.save();

    await mailer(email, user.username, changePassToken);
    cb(null, "success , now please change your password , 1h in your hands");
  } catch (error: any) {
    logger.error(error);
    if (error instanceof HttpError) return cb(error, null);
    return cb(new HttpError("Internal server error", error.code || 500), null);
  }
};

export const changePasswordService = async (
  userId: JWT_RESULT | undefined,
  data: { oldPass: string; newPass: string },
  cb: (err: ERROR_TO_RETURN, result: any) => void
) => {
  try {
    const user = await User.findById(userId?.id);
    if (!user) throw new HttpError("User Not Found", 404);

    if (data!.oldPass === user.password)
      throw new HttpError("Invalid Password", 401);

    user.password = data!.newPass;
    user.save();

    cb(null, "password updated successfully");
  } catch (error: any) {
    logger.error(error);
    if (error instanceof HttpError) return cb(error, null);
    return cb(new HttpError("Internal server error", error.code || 500), null);
  }
};
