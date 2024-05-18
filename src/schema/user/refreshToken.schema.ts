import { object, string } from "zod";

export const refreshTokenSchema = object({
  body: object({
    refreshToken: string({
      required_error: "Refresh Token is required",
    }),
  }),
});
