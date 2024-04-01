import request from 'supertest';
import app from '../src/app';

describe('GET /', () => {
  it('responds with a json message', (done) => {
    request(app)
      .get('/')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, {
        success: true,
        message: 'Hello Day Craft!',
      }, done);
  });
});

describe('GET /', () => {
  it('responds with a json message', (done) => {
    request(app)
      .get('/health')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, {
        success: true,
        message: 'Server is running!',
      }, done);
  });
});
