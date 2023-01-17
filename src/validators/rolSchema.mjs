const createRolSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 4,
      errorMessage: {
        type: 'Field name should alphanumeric',
        minLength: 'Field name must contain a minimum of 4 characters',
      },
    },
    description: {
      type: 'string',
      errorMessage: {
        type: 'Field description should alphanumeric',
      },
    },
  },
  required: ['name'],
  errorMessage: {
    required: {
      name: 'Field name is required',
    },
  },
};

const updateRolSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 4,
      errorMessage: {
        type: 'Field name should alphanumeric',
        minLength: 'Field name must contain a minimum of 4 characters',
      },
    },
    description: {
      type: 'string',
      errorMessage: {
        type: 'Field description should alphanumeric',
      },
    },
    isActive: {
      type: 'boolean',
      errorMessage: {
        type: 'Field isActive should boolean',
      },
    },
  },
};

export { createRolSchema, updateRolSchema };
