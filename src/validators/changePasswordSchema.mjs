const changePasswordSchema = {
  type: 'object',
  properties: {
    oldPassword: {
      type: 'string',
      errorMessage: {
        type: 'Field oldPassword should alphanumeric',
      },
    },
    newPassword: {
      type: 'string',
      minLength: 7,
      pattern: '(?:(?=.*\\d)|(?=.*\\W+))(?![.\\n])(?=.*[A-Z])(?=.*[a-z]).*$',
      errorMessage: {
        type: 'Field newPassword should alphanumeric',
        minLength: 'Field newPassword must contain a minimum of 7 characters',
        pattern: 'Field newPassword must have a Uppercase, lowercase letter and a number',
      },
    },
  },
  required: ['oldPassword', 'newPassword'],
  errorMessage: {
    required: {
      oldPassword: 'oldPassword is required',
      password: 'newPassword is required',
    },
  },
};

export default changePasswordSchema;
