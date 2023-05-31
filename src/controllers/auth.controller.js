import authServices from '../services/auth.services.js';

export default {
  register: async (req, res, next) => {
    try {
      const { name, email, password } = req.body;
      const data = await authServices.register(name, email, password);
      res.status(200).json({
        status: 200,
        message: 'register account success',
        data: { newAccount: data },
      });
    } catch (err) {
      next(err);
    }
  },

  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const data = await authServices.login(email, password);
      res.status(200).json({
        status: 200,
        message: 'login success',
        data: { userLogin: data },
      });
    } catch (err) {
      next(err);
    }
  },
};
