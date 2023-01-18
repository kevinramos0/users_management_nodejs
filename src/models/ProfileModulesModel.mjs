import psql from 'sequelize';
import DB from '../configs/DB/DB.mjs';

class ProfileModules extends psql.Model {}
/** Inicializar el modelo */
ProfileModules.init(
  {
    id_profile: {
      type: psql.Sequelize.INTEGER,
      primaryKey: true,
    },
    id_module: {
      type: psql.Sequelize.INTEGER,
      primaryKey: true,
    },
  },
  {
    timestamps: false,
    sequelize: DB.connection(),
    tableName: 'profiles_modules',
  }
);

export default ProfileModules;
