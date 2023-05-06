export const ERROR_NAME = {
  USERNAME_ALREADY_EXIST: 'USERNAME_ALREADY_EXIST',
};

export const ERROR_TYPE = {
  USERNAME_ALREADY_EXIST: {
    message: 'Username already taken. Try another.',
    statusCode: 400,
  },
};

export const getErrorCode = (errorName: string | keyof typeof ERROR_TYPE) => {
  return ERROR_TYPE[errorName];
};
