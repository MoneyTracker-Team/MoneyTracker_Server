import User from '../model/user.model.js';
import { registerValidate, loginValidate } from '../helpers/validation.js';
import createError from 'http-errors';

export default {
  register: async (name, email, password) => {
    try {
      const newUser = {
        name,
        email,
        password,
      };
      //   validate data
      const { error } = registerValidate({ email: newUser.email, password: newUser.password, name: newUser.name });
      if (error) {
        throw createError.BadRequest(error.details[0].message);
      }
      //   check email has been exists
      const isExistEmail = await User.findOne({
        email,
      });
      if (isExistEmail) {
        throw createError.Conflict('This is email already exists');
      }
      //   save new user to DB
      const data = await User.create(newUser);
      return Promise.resolve(data);
    } catch (err) {
      throw err;
    }
  },

  login: async (email, password) => {
    try {
      // validate data
      const { error } = loginValidate({ email, password });
      if (error) {
        throw createError.BadRequest(error.details[0].message);
      }
      //   check email exists
      const user = await User.findOne({ email });
      if (!user) {
        throw createError.Unauthorized('This email is not exists!');
      }
      //   compare password
      if (password !== user.password) {
        throw createError.Unauthorized();
      }
      return Promise.resolve(user);
    } catch (err) {
      throw err;
    }
  },
};
