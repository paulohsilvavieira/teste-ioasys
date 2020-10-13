import { Request, Response } from 'express';
import { header, validationResult } from 'express-validator';
import { getConnection } from 'typeorm';
import jwt from 'jsonwebtoken';
import { Admins } from '../../models/Admins';
import { Movies } from '../../models/Movies';

const listMovies = {
  validations: [
    header('Authorization').custom(async token => {
      if (token.length === 0 || token.split(' ')[1].length === 0) {
        throw new Error('Invalid Token');
      }
      if (!jwt.verify(token.split(' ')[1], process.env.JWT_SECRET)) {
        throw new Error('Invalid Token');
      }
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET);

      const { id } = decoded;
      const admin = await getConnection().manager.count(Admins, { id });
      if (admin === 0) {
        throw new Error('Only admins make this action');
      }
      return true;
    }),
  ],
  handle: async (request: Request, response: Response) => {
    try {
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
      }

      // const { id } = request.params;
      const { id } = request.params;

      const movies = await getConnection().manager.find(Movies, {
        where: { id },
      });

      return response.status(200).json({ movies });
    } catch (error) {
      /* istanbul ignore next */
      return response.status(500).json({
        error: new Error(error).message,
      });
    }
  },
};

export default listMovies;
