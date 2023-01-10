const profileSchema = {
  type: 'object',
  properties: {
    firstName: {
      type: 'string',
      minLength: 2,
      errorMessage: {
        type: 'El campo nombres debe ser de tipo string',
        minLength: 'El campo nombres debe contener un minimo de 2 caracteres',
      },
    },
    lastName: {
      type: 'string',
      minLength: 2,
      errorMessage: {
        type: 'El campo apellidos debe ser de tipo string',
        minLength: 'El campo apellidos debe contener un minimo de 2 caracteres',
      },
    },
    phone: {
      type: 'string',
      minLength: 9,
      errorMessage: {
        type: 'El campo telefono debe ser de tipo string',
        minLength: 'El campo telefono debe contener un mínimo de 9 caracteres',
      },
    },
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
      minLength: 7,
      errorMessage: {
        type: 'Contraseña debe ser de tipo alfanumerico',
        minLength: 'La contraseña debe contener minimo 7 caracteres',
      },
    },
  },
  required: ['firstName', 'lastName', 'phone', 'email', 'password'],
  errorMessage: {
    required: {
      firstName: 'El campo nombres es obligatorio',
      lastName: 'El campo apllidos es obligatorio',
      phone: 'El campo telefono en obligatorio',
      email: 'El email es obligatorio',
      password: 'El campo contraseña es obligatorio',
    },
  },
};

export default profileSchema;
