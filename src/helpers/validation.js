import Joi from 'joi';

export const registerValidate = (data) => {
  const RegisterSchema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(5).max(20).required(),
    name: Joi.string().required(),
  });
  return RegisterSchema.validate(data);
};

export const loginValidate = (data) => {
  const LoginSchema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(5).max(20).required(),
  });
  return LoginSchema.validate(data);
};
