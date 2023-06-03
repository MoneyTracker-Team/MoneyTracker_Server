import Joi from 'joi';

//* Validate password
export const changePasswordValidate = (data) => {
  const ChangePasswordSchema = Joi.object({
    oldPassword: Joi.string().min(5).max(20).required(),
    newPassword: Joi.string().min(5).max(20).required(),
  });
  return ChangePasswordSchema.validate(data);
};

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

//* Validate schedule
export const scheduleValidate = (data) => {
  const ScheduleSchema = Joi.object({
    userId: Joi.string().required(),
    month: Joi.number().required(),
    year: Joi.number().required(),
    scheduleMoney: Joi.number().required(),
  });
  return ScheduleSchema.validate(data);
};

//* Validade History Ajust
export const displaceValidate = (data) => {
  const DisplaceSchema = Joi.object({
    displace: Joi.number().required(),
  });
  return DisplaceSchema.validate(data);
};

//* Validate Loan
export const createLoanValidate = (data) => {
  const LoanSchema = Joi.object({
    userId: Joi.string().required(),
    debtorId: Joi.string().required(),
    moneySpend: Joi.number().required(),
    dateTime: Joi.date().allow('').optional(),
    location: Joi.string().allow('').optional(),
    image: Joi.string().allow('').optional(),
    note: Joi.string().allow('').optional(),
    isDebt: Joi.boolean().required(),
  });
  return LoanSchema.validate(data);
};

export const updateLoanValidate = (data) => {
  const LoanSchema = Joi.object({
    debtorId: Joi.string(),
    moneySpend: Joi.number(),
    dateTime: Joi.date().allow('').optional(),
    location: Joi.string().allow('').optional(),
    image: Joi.string().allow('').optional(),
    note: Joi.string().allow('').optional(),
  });
  return LoanSchema.validate(data);
};
