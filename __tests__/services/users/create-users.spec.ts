import { request } from '../../helpers';
import * as initializers from '../../../src/initializers';

describe('Users Routes', () => {
  beforeAll(async () => {
    await initializers.database.create();
  });

  /*  afterAll(async () => {
    await initializers.database.close();
  });**/

  beforeEach(async () => {
    await initializers.database.clear();
  });

  it('User Create Route Success', async done => {
    const response = await request.post('/users').send({
      email: 'email@email.com',
      name: 'john Doe',
      password: 'Password',
    });
    expect(response.status).toEqual(201);
    done();
  });

  it('User Create Route Error Validation', async done => {
    const response = await request.post('/users').send({
      email: 'email@e',
    });
    expect(response.status).toEqual(400);
    done();
  });
});
