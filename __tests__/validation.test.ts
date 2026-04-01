import { describe, it, expect } from 'vitest';
import {
  sanitizeText,
  sanitizeHtml,
  chatMessageSchema,
  emailSchema,
  passwordSchema,
  validateFileUpload,
} from '@/lib/security/validation';

describe('Input Validation & Sanitization', () => {
  // ============================================
  // Text Sanitization Tests
  // ============================================
  describe('sanitizeText', () => {
    it('should remove angle brackets', () => {
      expect(sanitizeText('<script>alert("xss")</script>')).toBe(
        'scriptalertxssscript'
      );
    });

    it('should trim whitespace', () => {
      expect(sanitizeText('  hello world  ')).toBe('hello world');
    });

    it('should limit length to 5000 characters', () => {
      const longString = 'a'.repeat(10000);
      expect(sanitizeText(longString).length).toBe(5000);
    });

    it('should handle empty strings', () => {
      expect(sanitizeText('')).toBe('');
    });
  });

  // ============================================
  // HTML Sanitization Tests
  // ============================================
  describe('sanitizeHtml', () => {
    it('should allow safe HTML tags', () => {
      const input = '<p>Hello <strong>world</strong></p>';
      const result = sanitizeHtml(input);
      expect(result).toContain('Hello');
      expect(result).toContain('world');
    });

    it('should remove script tags', () => {
      const input = '<script>alert("xss")</script><p>Safe</p>';
      const result = sanitizeHtml(input);
      expect(result).not.toContain('script');
      expect(result).toContain('Safe');
    });

    it('should remove event handlers', () => {
      const input = '<a href="javascript:alert(1)">click</a>';
      const result = sanitizeHtml(input);
      expect(result).not.toContain('javascript:');
    });
  });

  // ============================================
  // Schema Validation Tests
  // ============================================
  describe('emailSchema', () => {
    it('should validate correct emails', async () => {
      expect(await emailSchema.parseAsync('user@example.com')).toBe(
        'user@example.com'
      );
    });

    it('should reject invalid emails', async () => {
      await expect(emailSchema.parseAsync('invalid-email')).rejects.toThrow();
    });

    it('should convert to lowercase', async () => {
      expect(await emailSchema.parseAsync('USER@EXAMPLE.COM')).toBe(
        'user@example.com'
      );
    });
  });

  describe('passwordSchema', () => {
    it('should require minimum 12 characters', async () => {
      await expect(
        passwordSchema.parseAsync('ShortPass1!')
      ).rejects.toThrow();
    });

    it('should require uppercase letter', async () => {
      await expect(
        passwordSchema.parseAsync('shortpass123!')
      ).rejects.toThrow();
    });

    it('should require lowercase letter', async () => {
      await expect(
        passwordSchema.parseAsync('SHORTPASS123!')
      ).rejects.toThrow();
    });

    it('should require number', async () => {
      await expect(
        passwordSchema.parseAsync('ShortPassWord!')
      ).rejects.toThrow();
    });

    it('should require special character', async () => {
      await expect(
        passwordSchema.parseAsync('ShortPassword123')
      ).rejects.toThrow();
    });

    it('should accept valid password', async () => {
      const valid = 'ValidPass123!';
      expect(await passwordSchema.parseAsync(valid)).toBe(valid);
    });
  });

  describe('chatMessageSchema', () => {
    it('should validate normal chat messages', async () => {
      const msg = 'Hello, how are you?';
      expect(await chatMessageSchema.parseAsync(msg)).toBe(msg);
    });

    it('should reject empty messages', async () => {
      await expect(chatMessageSchema.parseAsync('')).rejects.toThrow();
    });

    it('should reject messages over 5000 characters', async () => {
      const longMsg = 'a'.repeat(5001);
      await expect(chatMessageSchema.parseAsync(longMsg)).rejects.toThrow();
    });

    it('should sanitize malicious input', async () => {
      const msg = '<script>alert("xss")</script>Hello';
      const result = await chatMessageSchema.parseAsync(msg);
      expect(result).not.toContain('script');
    });
  });

  // ============================================
  // File Upload Validation Tests
  // ============================================
  describe('validateFileUpload', () => {
    it('should accept valid image files', () => {
      const file = new File(['image data'], 'test.jpg', { type: 'image/jpeg' });
      const result = validateFileUpload(file, 5, ['image/jpeg', 'image/png']);
      expect(result.valid).toBe(true);
    });

    it('should reject invalid file types', () => {
      const file = new File(['script'], 'test.js', { type: 'application/javascript' });
      const result = validateFileUpload(file, 5, ['image/jpeg']);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('File type not allowed');
    });

    it('should reject files over size limit', () => {
      const file = new File(['a'.repeat(6000000)], 'large.jpg', { type: 'image/jpeg' });
      const result = validateFileUpload(file, 5, ['image/jpeg']);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('exceeds 5MB');
    });

    it('should reject missing files', () => {
      const result = validateFileUpload(null as any, 5, ['image/jpeg']);
      expect(result.valid).toBe(false);
    });
  });
});

export default {};
