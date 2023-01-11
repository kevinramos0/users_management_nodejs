const loginSchema = {
  type: 'object',
  properties: {
    email: {
      type: 'string',
      format: 'email',
      errorMessage: {
        type: 'Field email should alphanumeric',
        format: 'Field email should email address',
      },
    },
    password: {
      type: 'string',
      errorMessage: {
        type: 'Field password should alphanumeric',
      },
    },
  },
  required: ['email', 'password'],
  errorMessage: {
    required: {
      email: 'email is required',
      password: 'password is required',
    },
  },
};

export default loginSchema;
