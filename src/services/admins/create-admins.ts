import { Request, Response } from 'express';
import { validationResult, body } from 'express-validator';
import { getConnection } from 'typeorm';
import { Admins } from '../../models/Admins';
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

      const admin = new Admins();
      admin.email = request.body.email;
      admin.password = await bcrypt.hash(request.body.password, salt);

      admin.name = request.body.name;
      admin.delete = false;

      await getConnection().manager.save(admin);

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
