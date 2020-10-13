import { Request, Response } from 'express';
import { validationResult, body } from 'express-validator';
import { getConnection } from 'typeorm';
import { Users } from '../../models/Users';
import bcrypt from 'bcrypt';
const createAdmin = {
  validations: [
    body('email').isEmail(),
    body('name').isLength({ min: 5 }),
    body('password').isLength({ min: 5 }),
  ],
  handle: async (request: Request, response: Response) => {
    try {
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
      }
      const salt = await bcrypt.genSalt(10);

      const user = new Users();
      user.email = request.body.email;
      user.password = await bcrypt.hash(request.body.password, salt);
      user.name = request.body.name;
      user.delete = false;

      await getConnection().manager.save(user);

      return response.status(201).json({});
    } catch (error) {
      /* istanbul ignore next */
      return response.status(500).json({
        error: new Error(error).message,
      });
    }
  },
};

export default createAdmin;
