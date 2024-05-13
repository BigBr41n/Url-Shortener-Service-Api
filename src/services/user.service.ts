import bcrypt from "bcrypt";
import User from "../models/user.model";
import { HttpError } from "../models/CustomError";
import logger from "../utils/logger";
import jwt from "jsonwebtoken";
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
    const token = signJwt(user._id);
    if (token === null) {
      throw new HttpError("Internal server error", 500);
    }

    cb(null, token);
  } catch (err: any) {
    cb(new HttpError(err.message, err.code || 500), null);
  }
}
