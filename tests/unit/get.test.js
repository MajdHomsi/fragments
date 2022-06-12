const request = require('supertest');

const app = require('../../src/app');

describe('GET /v1/fragments', () => {
  test('all unauthenticated requests denied', () => request(app).get('/v1/fragments').expect(401));
  test('incorrect credentials denied', () =>
    request(app).get('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  test('authenticated users get a fragments array (user has no fragments: still get an array)', async () => {
    const res = await request(app).get('/v1/fragments').auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(Array.isArray(res.body.fragments)).toBe(true);
  });

  test('authenticated users get a fragments array of ids: user with fragments', async () => {
    const postRes1 = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('this is fragment 1');
    const id1 = JSON.parse(postRes1.text).fragment.id;

    const postRes2 = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is fragment 2');
    const id2 = JSON.parse(postRes2.text).fragment.id;

    const getRes = await request(app).get('/v1/fragments').auth('user1@email.com', 'password1');
    expect(getRes.statusCode).toBe(200);
    expect(getRes.body.fragments).toEqual([id1, id2]);
  });

  test('Get request with ?expand=1 should get expanded fragment metadata', async () => {
    const postRes1 = await request(app)
      .post('/v1/fragments')
      .auth('user2@email.com', 'password2')
      .set('Content-Type', 'text/plain')
      .send('this is fragment 1');
    const fragment1 = JSON.parse(postRes1.text).fragment;

    const postRes2 = await request(app)
      .post('/v1/fragments')
      .auth('user2@email.com', 'password2')
      .set('Content-Type', 'text/plain')
      .send('This is fragment 2');
    const fragment2 = JSON.parse(postRes2.text).fragment;

    const getRes = await request(app)
      .get('/v1/fragments')
      .query({ expand: 1 })
      .auth('user2@email.com', 'password2');

    expect(getRes.statusCode).toBe(200);
    expect(getRes.body.status).toBe('ok');
    expect(Array.isArray(getRes.body.fragments)).toBe(true);
    expect(getRes.body.fragments).toEqual([fragment1, fragment2]);
  });
});
