const createModuleSchema = {
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
    nameRoute: {
      type: 'string',
      minLength: 4,
      errorMessage: {
        type: 'Field nameRoute should alphanumeric',
        minLength: 'Field nameRoute must contain a minimum of 4 characters',
      },
    },
    description: {
      type: 'string',
      errorMessage: {
        type: 'Field description should alphanumeric',
      },
    },
    icon: {
      type: 'string',
      minLength: 4,
      errorMessage: {
        type: 'Field icon should alphanumeric',
        minLength: 'Field icon must contain a minimum of 4 characters',
      },
    },
    isPublic: {
      type: 'boolean',
      errorMessage: {
        type: 'Field isPublic should boolean',
      },
    },
  },
  required: ['name', 'nameRoute', 'icon', 'isPublic'],
  errorMessage: {
    required: {
      name: 'Field name is required',
      nameRoute: 'Field nameRoute is required',
      icon: 'Field icon is required',
      isPublic: 'Field isPublic is required',
    },
  },
};

const updateModuleSchema = {
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
    nameRoute: {
      type: 'string',
      minLength: 4,
      errorMessage: {
        type: 'Field nameRoute should alphanumeric',
        minLength: 'Field nameRoute must contain a minimum of 4 characters',
      },
    },
    description: {
      type: 'string',
      errorMessage: {
        type: 'Field description should alphanumeric',
      },
    },
    icon: {
      type: 'string',
      minLength: 4,
      errorMessage: {
        type: 'Field icon should alphanumeric',
        minLength: 'Field icon must contain a minimum of 4 characters',
      },
    },
    isPublic: {
      type: 'boolean',
      errorMessage: {
        type: 'Field isPublic should boolean',
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

export { createModuleSchema, updateModuleSchema };
