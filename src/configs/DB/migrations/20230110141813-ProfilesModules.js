const DataTypes = require('sequelize');

module.exports = {
  /** Crear tabla en la base de datos */
  up: async (queryInterface) => {
    await queryInterface.createTable('profiles_modules', {
      id_profile: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: 'profiles',
          key: 'id',
        },
      },
      id_module: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: 'modules',
          key: 'id',
        },
      },
    });
  },
  /** Eliminar tabla de la base de datos */
  down: async (queryInterface) => {
    await queryInterface.dropTable('profiles_modules');
  },
};
