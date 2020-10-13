import { Request, Response } from 'express';
import { validationResult, body, header } from 'express-validator';
import { getConnection } from 'typeorm';
import { Users } from '../../models/Users';
import jwt from 'jsonwebtoken';

const updateUser = {
  validations: [
    body('email').isEmail(),
    body('name').isLength({ min: 5 }),
    body('password').isLength({ min: 5 }),
    header('Authorization').custom(token => {
      if (!jwt.verify(token.split(' ')[1], process.env.JWT_SECRET)) {
        return new Error('Invalid Token');
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

      const user = new Users();
      user.email = request.body.email;
      user.password = request.body.password;
      user.name = request.body.name;

      const { id } = decoded;
      await getConnection().manager.update(Users, { id }, user);

      return response.status(204).json({});
    } catch (error) {
      /* istanbul ignore next */
      return response.status(500).json({
        error: new Error(error).message,
      });
    }
  },
};

export default updateUser;
