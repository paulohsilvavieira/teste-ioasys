import { request } from './helpers';

describe('Routes', () => {
  it('Test Index Route', async done => {
    const response = await request.get('/');
    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty('msg');
    expect(response.body.msg).toEqual('Hello World');
    done();
  });
});
