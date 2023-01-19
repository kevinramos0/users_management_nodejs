const changePasswordSchema = {
  type: 'object',
  properties: {
    oldPassword: {
      type: 'string',
      errorMessage: {
        type: 'Field oldPassword should alphanumeric',
      },
    },
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
    confirmPassword: {
      type: 'string',
      errorMessage: {
        type: 'Field confirmPassword should alphanumeric',
      },
    },
  },
  required: ['oldPassword', 'password', 'confirmPassword'],
  errorMessage: {
    required: {
      oldPassword: 'oldPassword is required',
      password: 'password is required',
      Confirmpassword: 'confirmPassword is required',
    },
  },
};

export default changePasswordSchema;
