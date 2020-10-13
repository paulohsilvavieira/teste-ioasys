import { request } from '../../helpers';
import * as initializers from '../../../src/initializers';
import bcrypt from 'bcrypt';
import { Admins } from '../../../src/models/Admins';
import { getConnection } from 'typeorm';
import jwt from 'jsonwebtoken';

describe('Admins Routes', () => {
  let token = '';

  beforeAll(async () => {
    await initializers.database.create();
    const salt = await bcrypt.genSalt(10);
    const user = new Admins();
    user.email = 'johnadmin@email.com';
    user.password = await bcrypt.hash('passwordShow', salt);
    user.name = 'John Doe Admin';
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

  it('Admin Update Route Success', async done => {
    const response = await request
      .put('/admins')
      .send({
        email: 'emailadmin@email.com',
        name: 'john Doe Admin',
        password: 'Password',
      })
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(204);
    done();
  });

  it('Admin Update Route Error Validation', async done => {
    const response = await request
      .put('/admins')
      .send({
        email: 'email@e',
      })
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(400);
    done();
  });

  it('Admin Update Route Error Token Validation', async done => {
    const response = await request
      .put('/admins')
      .send({
        email: 'emailadmins@email.com',
        name: 'john Doe admin 2',
        password: 'Password',
      })
      .set('Authorization', `Bearer asdas`);
    expect(response.status).toEqual(400);
    done();
  });
});
