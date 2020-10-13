import { request } from '../../helpers';
import * as initializers from '../../../src/initializers';
import bcrypt from 'bcrypt';
import { getConnection } from 'typeorm';
import jwt from 'jsonwebtoken';
import { Admins } from '../../../src/models/Admins';
import { Users } from '../../../src/models/Users';
import { Movies } from '../../../src/models/Movies';

describe('Users Routes', () => {
  let token = '';
  let tokenAdmin = '';
  let movieId = 0;

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

    const movie = new Movies();

    movie.title = 'Supernatural';
    movie.sinopsys = 'Loren ispulun dksajdlkasjdlkajslkjsasdas';
    movie.director = 'Director 1';
    movie.casts = 'Actor1, actor2, actor3';
    movie.genre = 'terror';
    movie.delete = false;

    const userCreated = await getConnection().manager.save(user);
    const adminCreated = await getConnection().manager.save(admin);
    const movieCreated = await getConnection().manager.save(movie);
    movieId = movieCreated.id;

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

  it('User Update Route Success', async done => {
    const response = await request
      .put(`/movies/${movieId}`)
      .send({
        title: 'Supernatural',
        sinopsys: 'Loren ispulun dksajdlkasjdlkajslkjsasdas',
        directors: 'Director 1',
        casts: 'Actor1, actor2, actor3',
        genre: 'terror',
      })
      .set('Authorization', `Bearer ${tokenAdmin}`);
    expect(response.status).toEqual(204);
    done();
  });

  it('User Update Route Error Validation', async done => {
    const response = await request
      .put(`/movies/${movieId}`)
      .send({
        title: 'Supernatural',
      })
      .set('Authorization', `Bearer ${tokenAdmin}`);
    expect(response.status).toEqual(400);
    done();
  });
  it('User Update Route Error Token Validation', async done => {
    const response = await request
      .put(`/movies/${movieId}`)
      .send({
        title: 'Supernatural',
        synopsys: 'Loren ispulun dksajdlkasjdlkajslkjsasdas',
        directors: 'Director 1',
        actors: 'Actor1, actor2, actor3',
        genre: 'terror',
      })
      .set('Authorization', `Bearer asdas`);
    expect(response.status).toEqual(400);
    done();
  });
  it('User Update Route Error not Admin', async done => {
    const response = await request
      .put(`/movies/${movieId}`)
      .send({
        title: 'Supernatural',
        synopsys: 'Loren ispulun dksajdlkasjdlkajslkjsasdas',
        directors: 'Director 1',
        actors: 'Actor1, actor2, actor3',
        genre: 'terror',
      })
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(400);
    done();
  });
});
