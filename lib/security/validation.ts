/**
 * Input Validation & Sanitization Utilities
 * Prevents XSS, SQL Injection, and other injection attacks
 */

import DOMPurify from 'isomorphic-dompurify';
import { z } from 'zod';

/**
 * Sanitize HTML content to prevent XSS attacks
 */
export const sanitizeHtml = (html: string): string => {
  if (!html) return '';
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'br', 'p', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href', 'title'],
    KEEP_CONTENT: true,
  });
};

/**
 * Sanitize plain text to prevent injection
 */
export const sanitizeText = (text: string): string => {
  if (!text) return '';
  return text
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .substring(0, 5000); // Limit length
};

/**
 * Validate and sanitize chat message
 */
export const chatMessageSchema = z
  .string()
  .min(1, 'Message cannot be empty')
  .max(5000, 'Message is too long')
  .transform((val) => sanitizeText(val));

/**
 * Validate user input for journal entries
 */
export const journalEntrySchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title is too long')
    .transform((val) => sanitizeText(val)),
  content: z
    .string()
    .min(1, 'Content cannot be empty')
    .max(10000, 'Content is too long')
    .transform((val) => sanitizeHtml(val)),
  mood: z.enum(['happy', 'sad', 'anxious', 'neutral', 'excited', 'angry', 'peaceful']),
  tags: z.array(z.string().max(50)).optional(),
});

/**
 * Validate user profile update
 */
export const userProfileSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Name too short')
    .max(100, 'Name too long')
    .transform((val) => sanitizeText(val))
    .optional(),
  bio: z
    .string()
    .max(500, 'Bio too long')
    .transform((val) => sanitizeText(val))
    .optional(),
  avatar: z.string().url('Invalid avatar URL').optional(),
  email: z.string().email('Invalid email').transform((val) => val.toLowerCase()),
  preferences: z
    .object({
      notifications: z.boolean().default(true),
      privateProfile: z.boolean().default(false),
      newsletter: z.boolean().default(true),
    })
    .optional(),
});

/**
 * Validate email input
 */
export const emailSchema = z.string().email('Invalid email address').transform((val) => val.toLowerCase());

/**
 * Validate password strength
 */
export const passwordSchema = z
  .string()
  .min(12, 'Password must be at least 12 characters')
  .regex(/[A-Z]/, 'Password must contain uppercase letter')
  .regex(/[a-z]/, 'Password must contain lowercase letter')
  .regex(/[0-9]/, 'Password must contain number')
  .regex(/[!@#$%^&*]/, 'Password must contain special character');

/**
 * Validate search query
 */
export const searchQuerySchema = z
  .string()
  .min(1, 'Search query cannot be empty')
  .max(200, 'Search query is too long')
  .transform((val) => sanitizeText(val));

/**
 * Rate limiting check helper
 */
export const checkRateLimit = (
  key: string,
  calls: number = 100,
  windowMs: number = 900000 // 15 minutes
): boolean => {
  if (typeof window === 'undefined') return true; // Skip on server

  const now = Date.now();
  const storageKey = `ratelimit_${key}`;
  const stored = localStorage.getItem(storageKey);

  if (!stored) {
    localStorage.setItem(storageKey, JSON.stringify({ count: 1, reset: now + windowMs }));
    return true;
  }

  const data = JSON.parse(stored);
  if (now > data.reset) {
    localStorage.setItem(storageKey, JSON.stringify({ count: 1, reset: now + windowMs }));
    return true;
  }

  data.count++;
  localStorage.setItem(storageKey, JSON.stringify(data));
  return data.count <= calls;
};

/**
 * Validate file uploads
 */
export const validateFileUpload = (
  file: File,
  maxSizeMb: number = 5,
  allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/webp']
): { valid: boolean; error?: string } => {
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'File type not allowed' };
  }

  if (file.size > maxSizeMb * 1024 * 1024) {
    return { valid: false, error: `File size exceeds ${maxSizeMb}MB` };
  }

  return { valid: true };
};

/**
 * Escape special characters for safe database queries
 */
export const escapeString = (str: string): string => {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "''")
    .replace(/"/g, '\\"')
    .replace(/\0/g, '\\0')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\x1a/g, '\\Z');
};

export default {
  sanitizeHtml,
  sanitizeText,
  chatMessageSchema,
  journalEntrySchema,
  userProfileSchema,
  emailSchema,
  passwordSchema,
  searchQuerySchema,
  checkRateLimit,
  validateFileUpload,
  escapeString,
};
