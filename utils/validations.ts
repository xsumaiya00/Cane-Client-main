import { z } from "zod";

export const questionnaireSchema = z.object({
  answers: z.record(z.string().min(1, "This field is required")),
});

export const signInSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .max(255, "Maximum number of characters is 255")
    .email(),
  password: z
    .string()
    .min(1, "Password is required")
    .max(255, "Maximum number of characters is 255"),
});
export type SignInSchemaType = z.infer<typeof signInSchema>;

export const signUpSchema = z
  .object({
    email: z
      .string()
      .min(1, "Email is required")
      .max(255, "Maximum number of characters is 255")
      .email("Invalid email format"),
    password1: z
      .string()
      .min(8, "Must be at least 8 characters in length")
      .max(255, "Maximum number of characters is 255")
      .regex(/.*[A-Z].*/, "Must include at least one uppercase character")
      .regex(/.*[a-z].*/, "Must include at least one lowercase character")
      .regex(/.*\d.*/, "Must include at least one number")
      .regex(
        /.*[`~<>?,./!@#$%^&*()\-_+="'|{}\\[\];:\\].*/,
        "Must include at least one special character",
      ),
    password2: z
      .string()
      .min(1, "Confirm password is required")
      .max(255, "Maximum number of characters is 255"),
  })
  .refine((data) => data.password1 === data.password2, {
    message: "Passwords must match",
    path: ["password2"],
  });
export type SignUpSchemaType = z.infer<typeof signUpSchema>;

export const textSchema = z.object({
  text: z
    .string()
    .min(1, "Sentence is required")
    .max(255, "Maximum number of characters is 255"),
});
export type TextSchemaType = z.infer<typeof textSchema>;

export const profileSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .max(255, "Maximum number of characters is 255")
    .email(),
  first_name: z
    .string()
    .min(1, "First name is required")
    .max(255, "Maximum number of characters is 255"),
  last_name: z
    .string()
    .min(1, "First name is required")
    .max(255, "Maximum number of characters is 255"),
});
export type ProfileSchemaType = z.infer<typeof profileSchema>;
