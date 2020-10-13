import { Router } from 'express';
import * as Services from './services';
const router = Router();

router.post(
  '/users',
  Services.Users.createUsers.validations,
  Services.Users.createUsers.handle
);

router.put(
  '/users',
  Services.Users.updateUser.validations,
  Services.Users.updateUser.handle
);

router.delete(
  '/users',
  Services.Users.deleteUser.validations,
  Services.Users.deleteUser.handle
);

router.post(
  '/admins',
  Services.Admins.createAdmin.validations,
  Services.Admins.createAdmin.handle
);

router.put(
  '/admins',
  Services.Admins.updateAdmin.validations,
  Services.Admins.updateAdmin.handle
);

router.delete(
  '/admins',
  Services.Admins.deleteAdmin.validations,
  Services.Admins.deleteAdmin.handle
);

router.post(
  '/login',
  Services.Auth.login.validations,
  Services.Auth.login.handle
);

router.post(
  '/movies',
  Services.Movies.createMovies.validations,
  Services.Movies.createMovies.handle
);

router.put(
  '/movies/:id',
  Services.Movies.updateMovies.validations,
  Services.Movies.updateMovies.handle
);

router.delete(
  '/movies/:id',
  Services.Movies.deleteMovies.validations,
  Services.Movies.deleteMovies.handle
);

router.get(
  '/movies/:id',
  Services.Movies.getMovie.validations,
  Services.Movies.getMovie.handle
);

router.get(
  '/movies/list',
  Services.Movies.listMovies.validations,
  Services.Movies.listMovies.handle
);

router.post(
  '/vote',
  Services.Votes.createVote.validations,
  Services.Votes.createVote.handle
);

export default router;
