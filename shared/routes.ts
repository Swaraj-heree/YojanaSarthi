import { z } from "zod";
import { schemeSchema, userProfileSchema } from "./schema";

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
  }),
};

export const api = {
  schemes: {
    list: {
      method: "GET" as const,
      path: "/api/schemes" as const,
      responses: {
        200: z.array(schemeSchema),
      },
    },
  },
  match: {
    create: {
      method: "POST" as const,
      path: "/api/match" as const,
      input: userProfileSchema,
      responses: {
        200: z.array(schemeSchema),
        400: errorSchemas.validation,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type Scheme = z.infer<typeof schemeSchema>;
export type UserProfile = z.infer<typeof userProfileSchema>;
