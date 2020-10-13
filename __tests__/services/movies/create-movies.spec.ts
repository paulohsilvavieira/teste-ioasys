import { request } from '../../helpers';
import * as initializers from '../../../src/initializers';
import bcrypt from 'bcrypt';
import { getConnection } from 'typeorm';
import jwt from 'jsonwebtoken';

import { Admins } from '../../../src/models/Admins';
import { Users } from '../../../src/models/Users';

describe('Admins Routes', () => {
  let token = '';
  let tokenAdmin = '';

  beforeAll(async () => {
    await initializers.database.create();
    const salt = await bcrypt.genSalt(10);
    const user = new Users();
    user.email = 'john@email.com';
    user.password = await bcrypt.hash('passwordShow', salt);
    user.name = 'John Doe';
    user.delete = false;

    const admin = new Admins();
    admin.email = 'johnadmin@email.com';
    admin.password = await bcrypt.hash('passwordShow', salt);
    admin.name = 'John Doe Admin';
    admin.delete = false;

    const userCreated = await getConnection().manager.save(user);
    const adminCreated = await getConnection().manager.save(admin);

    token = jwt.sign(
      { id: userCreated.id, email: userCreated.email },
      process.env.JWT_SECRET
    );
    tokenAdmin = jwt.sign(
      { id: adminCreated.id, email: adminCreated.email },
      process.env.JWT_SECRET
    );
  });

  /*  afterAll(async () => {
    await initializers.database.close();
  });**/

  beforeEach(async () => {
    await initializers.database.clear();
  });

  it('Create Movies Route Success', async done => {
    const response = await request.post('/movies').send({
      title: 'Supernatural',
      synopsys: 'Loren ispulun dksajdlkasjdlkajslkjsasdas',
      directors: 'Director 1',
      actors: 'Actor1, actor2, actor3',
      genre: 'terror',
    });
    expect(response.status).toEqual(201);
    done();
  });

  it('Admins Create Route Error Validation', async done => {
    const response = await request.post('/admins').send({
      title: 'Supernatural',
    });
    expect(response.status).toEqual(400);
    done();
  });
});
