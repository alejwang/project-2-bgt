/**
 * @jest-environment node
 */

const request = require('supertest');
const app = require('./app');

describe('GET /', () => {
  it('should return 200 OK', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
  });
});
