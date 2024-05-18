import { object, string } from "zod";

export const changePassSchema = object({
  body: object({
    oldPassword: string({
      required_error: "Old Password is required",
    }),
    password: string({
      required_error: "Password is required",
    }).min(6, "Password too short - should be 6 chars minimum"),
  }),
});
