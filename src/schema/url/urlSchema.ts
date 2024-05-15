import { object, string } from "zod";

export const shortenUrlSchema = object({
  body: object({
    url: string({
      required_error: "long url required",
    }),
    aliasProvided: string().optional(),
  }),
});

export const updateUrlSchema = object({
  body: object({
    url: string({
      required_error: "long url required",
    }),
    aliasProvided: string().optional(),
  }),
});

export const redirectUrlSchema = object({
  params: object({
    shortCode: string({
      required_error: "short url code required",
    }),
  }),
});

export const deleteUrlSchema = object({
  params: object({
    shortCode: string({
      required_error: "short url code required",
    }),
  }),
});

export const analyticsSchema = object({
  params: object({
    shortCode: string({
      required_error: "shorted Url code required",
    }),
  }),
});

export const QrCodeUrlSchema = object({
  query: object({
    url: string({
      required_error: "shorted Url code required",
    }),
  }),
});
