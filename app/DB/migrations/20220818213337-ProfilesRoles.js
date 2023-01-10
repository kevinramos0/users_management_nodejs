const DataTypes = require('sequelize');

module.exports = {
  /** Crear tabla en la base de datos */
  up: async (queryInterface) => {
    await queryInterface.createTable('profiles_rols', {
      id_profile: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: 'profiles',
          key: 'id',
        },
      },
      id_rol: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: 'rols',
          key: 'id',
        },
      },
    });
  },
  /** Eliminar tabla de la base de datos */
  down: async (queryInterface) => {
    await queryInterface.dropTable('profiles_rols');
  },
};
