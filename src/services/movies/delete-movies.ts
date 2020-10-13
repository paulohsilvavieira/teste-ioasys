import { Request, Response } from 'express';
import { header, validationResult } from 'express-validator';
import { getConnection } from 'typeorm';
import { Movies } from '../../models/Movies';
import jwt from 'jsonwebtoken';
import { Admins } from '../../models/Admins';

const deleteMovies = {
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

      const { id } = request.params;
      await getConnection().manager.update(Movies, { id }, { delete: true });

      return response.status(204).json({});
    } catch (error) {
      /* istanbul ignore next */
      return response.status(500).json({
        error: new Error(error).message,
      });
    }
  },
};

export default deleteMovies;
