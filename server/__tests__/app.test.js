import { jest } from '@jest/globals';

jest.setTimeout(20000);

import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import app from '../index.js';

let mongoServer;

export const connectTestDB = async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(mongoUri);
    }
};

export const disconnectTestDB = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
};

beforeAll(async () => {
    // Start in-memory MongoDB instance
    await connectTestDB();
});

afterAll(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany();
    }
    // Close database connection and stop server
    await disconnectTestDB();
});

describe('Server Health Check', () => {
    test('should respond to health check', async () => {
        const response = await request(app)
            .get('/health') // Assuming you have a health endpoint
            .expect(200);

        expect(response.body).toHaveProperty('status', 'ok');
    });

    test('should handle 404 for unknown routes', async () => {
        await request(app)
            .get('/unknown-route')
            .expect(404);
    });
});

describe('Authentication Routes', () => {
    const agent = request.agent(app);

    test('should register a new user', async () => {
        const userData = {
            firstName: "Test",
            lastName: "User",
            email: "test@example.com",
            password: "testpassword123",
            mobile: 9876543210,
            dob: "1997-06-20",
            role: "admin"
        };

        const response = await agent
            .post('/v1/auth/signup')
            .send(userData);

        console.log(response.body);

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);

        // verify refresh token cookie exists
        expect(response.headers['set-cookie']).toBeDefined();
    });

    test('should login user', async () => {
        const loginData = {
            email: 'test@example.com',
            password: 'testpassword123'
        };

        const response = await agent
            .post('/v1/auth/login')
            .send(loginData);

        console.log(response.body);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);

        // verify cookie set
        expect(response.headers['set-cookie']).toBeDefined();
    });
});