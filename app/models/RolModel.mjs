import psql from 'sequelize';
import DB from '../DB/DB.mjs';
import ProfileRol from './ProfileRolModel.mjs';
// eslint-disable-next-line import/no-cycle
import Profile from './ProfileModel.mjs';

class Rol extends psql.Model {
  /** crear relacion del modelo */
  static relationship() {
    this.belongsToMany(Profile, {
      through: ProfileRol,
      foreignKey: 'id_rol',
      otherKey: 'id_profile',
    });
  }
}
/** Inicializar el modelo */
Rol.init({
  id: {
    type: psql.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: psql.Sequelize.STRING(50),
    allowNull: false,
  },
  description: {
    type: psql.Sequelize.STRING(100),
    allowNull: true,
  },
  isActive: {
    type: psql.Sequelize.BOOLEAN,
    defaultValue: true,
  },
}, {
  timestamps: false,
  sequelize: DB.connection(),
  tableName: 'rols',
});

export default Rol;
