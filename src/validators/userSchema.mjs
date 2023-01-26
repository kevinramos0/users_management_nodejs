const createUserSchema = {
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
      minLength: 7,
      pattern: '(?:(?=.*\\d)|(?=.*\\W+))(?![.\\n])(?=.*[A-Z])(?=.*[a-z]).*$',
      errorMessage: {
        type: 'Field password should alphanumeric',
        minLength: 'Field password must contain a minimum of 7 characters',
        pattern: 'Field password must have a Uppercase, lowercase letter and a number',
      },
    },
    profile: {
      type: 'integer',
      minimum: 1,
      nullable: true,
      errorMessage: {
        type: 'Field profile should a integer',
        minimun: 'Field profile should be a number positive',
      },
    },
  },
  required: ['email', 'password'],
  errorMessage: {
    required: {
      email: 'Field email is required',
      password: 'Field password is required',
    },
  },
};

const updateUserSchema = {
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
      minLength: 7,
      pattern: /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.toString(),
      errorMessage: {
        type: 'Field password should alphanumeric',
        minLength: 'Field password must contain a minimum of 7 characters',
        pattern: 'Field password must have a Uppercase, lowercase letter and a number',
      },
    },
    profile: {
      type: 'integer',
      minimum: 1,
      nullable: true,
      errorMessage: {
        type: 'Field profile should a integer',
        minimun: 'Field profile should be a number positive',
      },
    },
    isActive: {
      type: 'boolean',
      errorMessage: {
        type: 'Field isActive should a boolean',
      },
    },
    isVerified: {
      type: 'boolean',
      errorMessage: {
        type: 'Field isVerified should a boolean',
      },
    },
  },
};

export { createUserSchema, updateUserSchema };
