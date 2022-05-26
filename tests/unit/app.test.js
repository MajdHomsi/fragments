// A test using supertest that causes a 404 to occur

const request = require('supertest');
const app = require('../../src/app');

describe('404 occurrence test', () => {
  test('Returns an HTTP 404 response', async () => {
    const res = await request(app).get('/dummy');
    expect(res.statusCode).toBe(404);
  });
});
