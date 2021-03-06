import { request } from '../../helpers';
import * as initializers from '../../../src/initializers';
import bcrypt from 'bcrypt';
import { Users } from '../../../src/models/Users';
import { getConnection } from 'typeorm';
import jwt from 'jsonwebtoken';

describe('Users Routes', () => {
  let token = '';

  beforeAll(async () => {
    await initializers.database.create();
    const salt = await bcrypt.genSalt(10);
    const user = new Users();
    user.email = 'john@email.com';
    user.password = await bcrypt.hash('passwordShow', salt);
    user.name = 'John Doe';
    user.delete = false;

    const userCreated = await getConnection().manager.save(user);
    token = jwt.sign(
      { id: userCreated.id, email: userCreated.email },
      process.env.JWT_SECRET
    );
  });

  /*  afterAll(async () => {
    await initializers.database.close();
  });**/

  beforeEach(async () => {
    await initializers.database.clear();
  });

  it('User Update Route Success', async done => {
    const response = await request
      .put('/users')
      .send({
        email: 'email@email.com',
        name: 'john Doe',
        password: 'Password',
      })
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(204);
    done();
  });

  it('User Update Route Error Validation', async done => {
    const response = await request
      .put('/users')
      .send({
        email: 'email@e',
      })
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(400);
    done();
  });
  it('User Update Route Error Token Validation', async done => {
    const response = await request
      .put('/users')
      .send({
        email: 'email@email.com',
        name: 'john Doe',
        password: 'Password',
      })
      .set('Authorization', `Bearer asdas`);
    expect(response.status).toEqual(400);
    done();
  });
});
