import { describe, it, expect, beforeEach } from '@jest/globals';
import multer from 'multer';
import upload from '../../middleware/upload.js';

// Mock multer
jest.mock('multer');

describe('Upload Middleware', () => {
  it('should configure multer storage', () => {
    expect(upload).toBeDefined();
    // Upload middleware should be configured
    expect(typeof upload).toBe('object');
  });

  it('should have single file upload method', () => {
    expect(upload.single).toBeDefined();
    expect(typeof upload.single).toBe('function');
  });

  it('should have multiple files upload method', () => {
    expect(upload.array).toBeDefined();
    expect(typeof upload.array).toBe('function');
  });

  it('should have fields upload method', () => {
    expect(upload.fields).toBeDefined();
    expect(typeof upload.fields).toBe('function');
  });
});

