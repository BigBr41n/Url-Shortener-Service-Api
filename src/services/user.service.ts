import bcrypt from "bcrypt";
import User from "../models/user.model";
import Url from "../models/shortUrl.model";
import { HttpError } from "../models/CustomError";
import logger from "../utils/logger";
import { signJwt } from "../utils/jwt";

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
  cb: (error: HttpError | null, user: UserData | null) => void
) {
  const { username, email, password: ReqPass, company } = userData;

  // Check if the email is already registered
  const user = await User.findOne({ email });

  if (user) {
    throw new HttpError("already registered", 401);
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(ReqPass, 14);

    // Create a new user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      company,
    });

    const { password, userWithOutPassword } = newUser._doc;
    cb(null, userWithOutPassword);
  } catch (err: any) {
    logger.error(err.message);
    cb(new HttpError("Internal server error", err.code || 500), null);
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
  } catch (err: any) {
    cb(new HttpError(err.message, err.code || 500), null);
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
    logger.error(error.message);
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
    return cb(new HttpError("Internal server error", error.code || 500), null);
  }
};

export const deleteUserService = async (
  userId: JWT_RESULT | undefined,
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

    for (const element of user.shortedUrl) {
      await Url.findByIdAndDelete(element);
    }

    cb(null);
  } catch (error: any) {
    logger.error(error);
    return cb(new HttpError("Internal server error", error.code || 500));
  }
};
