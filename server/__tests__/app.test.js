import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import app from '../index.js';

let mongoServer;

beforeAll(async () => {
    // Start in-memory MongoDB instance
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
});

afterAll(async () => {
    // Close database connection and stop server
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
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
    test('should register a new user', async () => {
        const userData = {
            email: 'test@example.com',
            password: 'testpassword123',
            name: 'Test User'
        };

        const response = await request(app)
            .post('/api/auth/register')
            .send(userData)
            .expect(201);

        expect(response.body).toHaveProperty('message');
        expect(response.body).toHaveProperty('user');
    });

    test('should login user', async () => {
        const loginData = {
            email: 'test@example.com',
            password: 'testpassword123'
        };

        const response = await request(app)
            .post('/api/auth/login')
            .send(loginData)
            .expect(200);

        expect(response.body).toHaveProperty('token');
        expect(response.body).toHaveProperty('user');
    });
});