/**
 * Server-side Validation Utilities (NO browser dependencies)
 * Used by API routes - safe for server bundling
 */

import { z } from 'zod';

/**
 * Sanitize plain text to prevent injection (server-safe)
 */
export const sanitizeTextServer = (text: string): string => {
  if (!text) return '';
  return text
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .substring(0, 5000); // Limit length
};

/**
 * Validate and sanitize chat message (server-safe)
 */
export const chatMessageSchemaServer = z
  .string()
  .min(1, 'Message cannot be empty')
  .max(5000, 'Message is too long')
  .transform((val) => sanitizeTextServer(val));
