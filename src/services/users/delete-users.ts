import { Request, Response } from 'express';
import { header, validationResult } from 'express-validator';
import { getConnection } from 'typeorm';
import { Users } from '../../models/Users';
import jwt from 'jsonwebtoken';

const deleteUser = {
  validations: [
    header('Authorization').custom(token => {
      if (token.length === 0 || token.split(' ')[1].length === 0) {
        throw new Error('Invalid Token');
      }
      if (!jwt.verify(token.split(' ')[1], process.env.JWT_SECRET)) {
        throw new Error('Invalid Token');
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
      const token = request.header('Authorization').split(' ')[1];

      const decoded: any = jwt.verify(token, process.env.JWT_SECRET);

      const { id } = decoded;
      await getConnection().manager.update(Users, { id }, { delete: true });

      return response.status(204).json({});
    } catch (error) {
      /* istanbul ignore next */
      return response.status(500).json({
        error: new Error(error).message,
      });
    }
  },
};

export default deleteUser;
