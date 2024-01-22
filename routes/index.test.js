// index.test.js
const express = require('express');
const request = require('supertest');
const router = require('./index');
const { Pool } = require('pg');

jest.mock('pg', () => {
  const mockQuery = jest.fn((queryText, queryParams, callback) => {
    callback(null, { rows: [{ id: 1 }] }); // Mock the expected result of the query
  });

  const mockClient = {
    query: mockQuery,
    release: jest.fn(), // Mock release if your actual client uses it
  };

  const mockConnect = jest.fn((callback) => {
    callback(null, mockClient, jest.fn());
  });

  return {
    Pool: jest.fn(() => ({
      on: jest.fn(),
      connect: mockConnect,
    })),
  };
});

describe('/candidateAdd route', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use(router);
  });

  test('should insert candidate data into the database', async () => {
    const mockData = {
      youtubeID: '123',
      email: 'test@example.com',
      fname: 'John',
      lname: 'Doe',
      twitter: '@johndoe',
    };

    const response = await request(app)
      .post('/candidateAdd')
      .send(mockData);

    expect(response.statusCode).toBe(200); // Adjust according to your actual response
    // Additional assertions can be added here if needed
  });
});
