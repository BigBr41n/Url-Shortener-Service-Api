import { object, string } from "zod";

export const updateUserSchema = object({
  body: object({
    username: string({
      required_error: "Name is required",
    }),
    email: string({
      required_error: "Email is required",
    }),
    company: object({
      name: string({
        required_error: "Company Name is required",
      }),
      professionalEmail: string({
        required_error: "Professional Email is required",
      }),
    }),
  }),
});
