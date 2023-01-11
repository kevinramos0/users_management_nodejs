const profileSchema = {
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
    rols: {
      type: 'array',
      items: { type: 'integer', errorMessage: { type: 'Elements of rols should be integer' } },
      // minItems: 1,
      uniqueItems: true,
      errorMessage: {
        type: 'Field rols should numeric array',
        // minItems: 'Field rols must contain a minimum of 1 element',
        uniqueItems: 'Field rols should unique elements',
      },
    },
    modules: {
      type: 'array',
      items: { type: 'integer', errorMessage: { type: 'Elements of modules should be integer' } },
      uniqueItems: true,
      errorMessage: {
        type: 'Field modules should numeric array',
        uniqueItems: 'Field modules should unique elements',
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

const updateProfileSchema = {
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
    rols: {
      type: 'array',
      items: { type: 'integer', errorMessage: { type: 'Elements of rols should be integer' } },
      // minItems: 1,
      uniqueItems: true,
      errorMessage: {
        type: 'Field rols should numeric array',
        // minItems: 'Field rols must contain a minimum of 1 element',
        uniqueItems: 'Field rols should unique elements',
      },
    },
    modules: {
      type: 'array',
      items: { type: 'integer', errorMessage: { type: 'Elements of modules should be integer' } },
      uniqueItems: true,
      errorMessage: {
        type: 'Field modules should numeric array',
        uniqueItems: 'Field modules should unique elements',
      },
    },
  },
};

export { profileSchema, updateProfileSchema };
