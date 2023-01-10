const changePasswordSchema = {
  type: 'object',
  properties: {
    oldPassword: {
      type: 'string',
      errorMessage: {
        type: 'La contraseña debe ser de tipo alfanumerico',
      },
    },
    newPassword: {
      type: 'string',
      minLength: 7,
      errorMessage: {
        type: 'La nueva contraseña debe ser de tipo alfanumerico',
        minLength: 'La nueva contraseña debe contener minimo 7 caracteres',
      },
    },
    confirmPassword: {
      type: 'string',
      errorMessage: {
        type: 'La nueva contraseña debe ser de tipo alfanumerico',
      },
    },
  },
  required: ['oldPassword', 'newPassword', 'confirmPassword'],
  errorMessage: {
    required: {
      oldPassword: 'El campo contraseña anterior es obligatorio',
      newPassword: 'El campo nueva contraseña es obligatorio',
      confirmPassword: 'El confirmar contraseña es obligatorio',
    },
  },
};

export default changePasswordSchema;
