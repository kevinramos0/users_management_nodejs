const resetPasswordSchema = {
  type: 'object',
  properties: {
    password: {
      type: 'string',
      minLength: 7,
      pattern: '(?:(?=.*\\d)|(?=.*\\W+))(?![.\\n])(?=.*[A-Z])(?=.*[a-z]).*$',
      errorMessage: {
        type: 'Field password should alphanumeric',
        minLength: 'Field password must contain a minimum of 7 characters',
        pattern: 'Field password must have a Uppercase, lowercase letter and a number',
      },
    },
  },
  required: ['password'],
  errorMessage: {
    required: {
      email: 'password is required',
    },
  },
};

export default resetPasswordSchema;
