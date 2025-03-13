const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const User = require('../models/User');
const Category = require('../models/Category');

let mongoServer;
let token;
let userId;

// Setup MongoDB Memory Server before all tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // Create a test user and get JWT token
  const user = await User.create({
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123'
  });
  userId = user._id;

  const res = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'test@example.com',
      password: 'password123'
    });
  
  token = res.body.token;
});

// Clean up database between tests
beforeEach(async () => {
  await Category.deleteMany({});
});

// Disconnect and stop MongoDB Memory Server after all tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Category Routes', () => {
  describe('POST /api/categories', () => {
    it('should create a new category', async () => {
      const res = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Meetings',
          color: '#FF5733'
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('name', 'Meetings');
      expect(res.body.data).toHaveProperty('color', '#FF5733');
    });

    it('should not create a category without required fields', async () => {
      const res = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${token}`)
        .send({
          color: '#FF5733'
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('errors');
    });

    it('should not create a duplicate category name for the same user', async () => {
      // Create first category
      await Category.create({
        name: 'Meetings',
        color: '#FF5733',
        user: userId
      });

      // Try to create duplicate
      const res = await request(app)
        .post