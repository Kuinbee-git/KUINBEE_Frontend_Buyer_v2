/**
 * Authentication validation schemas
 */

import { z } from "zod";

// Sign up schema
export const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must not exceed 128 characters"),
});

// Login schema
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// Email verification schema
export const sendEmailVerificationSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const confirmEmailVerificationSchema = z.object({
  email: z.string().email("Invalid email address"),
  token: z.string().min(1, "Token is required"),
});

// Password reset schemas
export const requestPasswordResetSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const confirmPasswordResetSchema = z.object({
  email: z.string().email("Invalid email address"),
  token: z.string().min(1, "Token is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must not exceed 128 characters"),
});

// Change password schema
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "New password must be at least 8 characters")
    .max(128, "New password must not exceed 128 characters"),
});

// Export types
export type SignUpFormData = z.infer<typeof signUpSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type SendEmailVerificationFormData = z.infer<
  typeof sendEmailVerificationSchema
>;
export type ConfirmEmailVerificationFormData = z.infer<
  typeof confirmEmailVerificationSchema
>;
export type RequestPasswordResetFormData = z.infer<
  typeof requestPasswordResetSchema
>;
export type ConfirmPasswordResetFormData = z.infer<
  typeof confirmPasswordResetSchema
>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
