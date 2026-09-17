import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  APP_URL: z.string().url().default("https://cotiza.netandsoft.com.ve"),
  PORT: z.coerce.number().default(3000),

  DATABASE_URL: z.string().min(1).default("postgresql://proposal_user:password@localhost:5432/proposal_builder?schema=public"),

  AUTH_SECRET: z.string().min(16).default("dev_auth_secret_key_minimum_32_characters_long!"),
  AUTH_TRUST_HOST: z.coerce.boolean().default(true),
  SESSION_MAX_AGE_HOURS: z.coerce.number().default(8),

  INITIAL_ADMIN_EMAIL: z.string().email().default("admin@netandsoft.com.ve"),
  INITIAL_ADMIN_PASSWORD: z.string().min(8).optional(),

  REDIS_URL: z.string().optional(),

  FORM_TOKEN_SECRET: z.string().min(16).default("dev_form_token_secret_key_minimum_32_characters_long!"),
  FORM_MIN_SUBMIT_SECONDS: z.coerce.number().default(3),
  FORM_TOKEN_TTL_MINUTES: z.coerce.number().default(30),

  RATE_LIMIT_PROPOSAL_ATTEMPTS: z.coerce.number().default(5),
  RATE_LIMIT_PROPOSAL_WINDOW_SECONDS: z.coerce.number().default(600),
  RATE_LIMIT_GLOBAL_ATTEMPTS: z.coerce.number().default(10),
  RATE_LIMIT_GLOBAL_WINDOW_SECONDS: z.coerce.number().default(3600),

  TURNSTILE_ENABLED: z.coerce.boolean().default(false),
  TURNSTILE_SITE_KEY: z.string().optional().default(""),
  TURNSTILE_SECRET_KEY: z.string().optional().default(""),

  SMTP_HOST: z.string().optional().default(""),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().optional().default(""),
  SMTP_PASSWORD: z.string().optional().default(""),
  SMTP_FROM: z.string().default('"Net & Soft Solutions" <cotiza@netandsoft.com.ve>'),

  GHL_ENABLED: z.coerce.boolean().default(false),
  GHL_WEBHOOK_URL: z.string().optional().default(""),
  GHL_API_KEY: z.string().optional().default(""),
  GHL_LOCATION_ID: z.string().optional().default(""),
  GHL_WEBHOOK_SECRET: z.string().optional().default(""),

  NEXT_PUBLIC_GTM_ID: z.string().optional().default(""),
});

export type Env = z.infer<typeof envSchema>;

let parsedEnv: Env;

try {
  parsedEnv = envSchema.parse(process.env);
} catch (error) {
  if (process.env.NODE_ENV === "production") {
    console.error("❌ Invalid environment variables:", error);
    throw new Error("Invalid environment variables in production");
  }
  // En desarrollo/test usar defaults seguros
  parsedEnv = envSchema.parse({});
}

export const env = parsedEnv;
