import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../../src/server';

let mongoServer: MongoMemoryServer;

describe('Environment API Tests', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  describe('GET /api/env', () => {
    test('should return environment as testing when NODE_ENV is testing', async () => {
      // NODE_ENV is set to 'testing' in package.json test scripts
      const response = await request(app).get('/api/env');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('environment');
      expect(response.body.environment).toBe('testing');
    });

    test('should return development as default when NODE_ENV is not set', async () => {
      const originalEnv = process.env.NODE_ENV;
      delete process.env.NODE_ENV;

      const response = await request(app).get('/api/env');
      
      expect(response.status).toBe(200);
      expect(response.body.environment).toBe('development');

      // Restore original NODE_ENV
      process.env.NODE_ENV = originalEnv;
    });

    test('should return correct environment when NODE_ENV is production', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const response = await request(app).get('/api/env');
      
      expect(response.status).toBe(200);
      expect(response.body.environment).toBe('production');

      // Restore original NODE_ENV
      process.env.NODE_ENV = originalEnv;
    });

    test('should return environment as development when explicitly set', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const response = await request(app).get('/api/env');
      
      expect(response.status).toBe(200);
      expect(response.body.environment).toBe('development');

      // Restore original NODE_ENV
      process.env.NODE_ENV = originalEnv;
    });

    test('should return valid JSON format', async () => {
      const response = await request(app).get('/api/env');
      
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(typeof response.body.environment).toBe('string');
    });

    test('should handle multiple consecutive requests correctly', async () => {
      const response1 = await request(app).get('/api/env');
      const response2 = await request(app).get('/api/env');
      const response3 = await request(app).get('/api/env');
      
      expect(response1.status).toBe(200);
      expect(response2.status).toBe(200);
      expect(response3.status).toBe(200);
      
      expect(response1.body.environment).toBe(response2.body.environment);
      expect(response2.body.environment).toBe(response3.body.environment);
    });
  });

  describe('Frontend Pages', () => {
    test('should serve index.html with 200 status', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/html/);
    });

    test('should serve create.html with 200 status', async () => {
      const response = await request(app).get('/create');
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/html/);
    });

    test('should serve detail.html with 200 status', async () => {
      const response = await request(app).get('/task/123');
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/html/);
    });
  });
});