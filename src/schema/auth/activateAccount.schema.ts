import { object, string } from "zod";

export const activateAccountSchema = object({
  query: object({
    token: string({
      required_error: "Token is required",
    }),
  }),
});
