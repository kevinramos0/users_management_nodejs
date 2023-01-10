const loginSchema = {
  type: 'object',
  properties: {
    email: {
      type: 'string',
      format: 'email',
      errorMessage: {
        type: 'El email debe ser de tipo alfanumerico',
        format: 'El email debe contener un formato válido',
      },
    },
    password: {
      type: 'string',
      minLength: 1,
      errorMessage: {
        type: 'El password debe ser de tipo alfanumerico',
        minLength: 'El password no puede ser vacio',
      },
    },
  },
  required: ['email', 'password'],
  errorMessage: {
    required: {
      email: 'El email es obligatorio',
      password: 'El password es obligatorio',
    },
  },
};

export default loginSchema;
