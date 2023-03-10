import psql from 'sequelize';
import DB from '../configs/DB/DB.mjs';

class ProfileRol extends psql.Model {}
/** Inicializar el modelo */
ProfileRol.init(
  {
    id_profile: {
      type: psql.Sequelize.INTEGER,
      primaryKey: true,
    },
    id_rol: {
      type: psql.Sequelize.INTEGER,
      primaryKey: true,
    },
  },
  {
    timestamps: false,
    sequelize: DB.connection(),
    tableName: 'profiles_rols',
  }
);

export default ProfileRol;
