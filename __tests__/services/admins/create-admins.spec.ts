import { request } from '../../helpers';
import * as initializers from '../../../src/initializers';

describe('Admins Routes', () => {
  beforeAll(async () => {
    await initializers.database.create();
  });

  /*  afterAll(async () => {
    await initializers.database.close();
  });**/

  beforeEach(async () => {
    await initializers.database.clear();
  });

  it('Admins Create Route Success', async done => {
    const response = await request.post('/admins').send({
      email: 'email@email.com',
      name: 'john Doe',
      password: 'Password',
    });
    expect(response.status).toEqual(201);
    done();
  });

  it('Admins Create Route Error Validation', async done => {
    const response = await request.post('/admins').send({
      email: 'email@e',
    });
    expect(response.status).toEqual(400);
    done();
  });
});
