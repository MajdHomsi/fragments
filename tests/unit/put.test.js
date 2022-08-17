// tests/unit/get.test.js
const request = require('supertest');
const app = require('../../src/app');

describe('PUT /v1/fragments/:id', () => {
  test('Cannot request unauthenticated requests', () =>
    request(app)
      .get('/v1/fragments')
      .send({
        body: 'This is a fragment',
      })
      .expect(401));

  test('PUT by ID updates existing fragment', async () => {
    const response = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .send({
        body: 'This is a fragment',
      });
    const id = await response.body.fragment.id;

    const res = await request(app)
      .put(`/v1/fragments/${id}`)
      .auth('user1@email.com', 'password1')
      .send({
        body: 'This is the update',
      });
    expect(res.statusCode).toBe(200);
  });
});
