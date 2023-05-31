import Joi from 'joi';

//* Validate authentication
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

//* Validate type spend
export const typeSpendValidate = (data) => {
  const TypeSpendSchema = Joi.object({
    userId: Joi.string().required(),
    name: Joi.string().required(),
    isDaily: Joi.boolean().default(true),
  });
  return TypeSpendSchema.validate(data);
};

//* Validate spend
export const spendValidate = (data) => {
  const SpendSchema = Joi.object({
    userId: Joi.string().required(),
    typeId: Joi.string().required(),
    moneySpend: Joi.number().required(),
    dateTime: Joi.date().required(),
  });
  return SpendSchema.validate(data);
};
