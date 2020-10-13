import { Request, Response } from 'express';
import { validationResult, body } from 'express-validator';
import { getConnection } from 'typeorm';
import { Users } from '../../models/Users';
import { Admins } from '../../models/Admins';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const login = {
  validations: [body('email').isEmail(), body('password').isLength({ min: 5 })],
  handle: async (request: Request, response: Response) => {
    try {
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
      }

      const findUser = await getConnection().manager.find(Users, {
        email: request.body.email,
      });

      if (findUser[0]) {
        if (bcrypt.compareSync(request.body.password, findUser[0].password)) {
          return response.status(200).json({
            token: jwt.sign({ id: findUser[0].id }, process.env.JWT_SECRET),
          });
        }
      }
      const findAdmin = await getConnection().manager.find(Admins, {
        email: request.body.email,
      });

      if (findAdmin[0]) {
        if (bcrypt.compareSync(request.body.password, findAdmin[0].password)) {
          return response.status(200).json({
            token: jwt.sign({ id: findAdmin[0].id }, process.env.JWT_SECRET),
          });
        }
      }

      return response.status(201).json({});
    } catch (error) {
      /* istanbul ignore next */
      return response.status(500).json({
        error: new Error(error).message,
      });
    }
  },
};

export default login;
