import jwt, { VerifyErrors } from "jsonwebtoken";
import logger from "./logger";
import fs from "fs";
import path from "path";

interface ObjectToSign {
  id: string;
}

const privateKey = fs.readFileSync(
  path.join(__dirname, "../..", "private.key"),
  "utf8"
);
const publicKey = fs.readFileSync(
  path.join(__dirname, "../..", "public.key"),
  "utf8"
);

const refreshTokenPrivateKey = fs.readFileSync(
  path.join(__dirname, "../..", "refTokenPrivate.key"),
  "utf-8"
);
const refreshTokenPublicKey = fs.readFileSync(
  path.join(__dirname, "../..", "refTokenPublic.key"),
  "utf-8"
);

export function signJwt(object: ObjectToSign): string | null {
  const jwtSecret = process.env.JWT_SECRET?.toString();

  try {
    if (!jwtSecret) {
      logger.error("JWT secret not set");
      return null;
    }

    const token = jwt.sign(object, privateKey, {
      algorithm: "RS256",
      expiresIn: "3h",
    });

    return token;
  } catch (error) {
    logger.error(error);
    return null;
  }
}

export function verifyJwt(token: string): any {
  jwt.verify(
    token,
    publicKey,
    { algorithms: ["RS256"] },
    (error: VerifyErrors | null, decoded: any | undefined) => {
      if (error) {
        logger.error(error);
        return { valid: false, expired: true };
      } else {
        return { valid: true, expired: false, decoded };
      }
    }
  );
}

export function signRefreshToken(object: ObjectToSign): string {
  return jwt.sign(object, refreshTokenPrivateKey, {
    algorithm: "RS256",
    expiresIn: "7d",
  });
}

export function verifyRefreshToken(token: string): any {
  try {
    const decoded = jwt.verify(token, refreshTokenPublicKey, {
      algorithms: ["RS256"],
    });
    return { valid: true, expired: false, decoded };
  } catch (error) {
    logger.error(error);
    return { valid: false, expired: true };
  }
}
