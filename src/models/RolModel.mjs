import psql from 'sequelize';
import DB from '../configs/DB/DB.mjs';
import ProfileRol from './ProfileRolModel.mjs';
// eslint-disable-next-line import/no-cycle
import Profile from './ProfileModel.mjs';

const RolSchema = {
  id: {
    type: psql.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: { type: psql.Sequelize.STRING, allowNull: false, unique: true },
  description: { type: psql.Sequelize.STRING, allowNull: true },
  is_active: { type: psql.Sequelize.BOOLEAN, defaultValue: true },
};

class Rol extends psql.Model {
  /** crear relacion del modelo */
  static relationship() {
    this.belongsToMany(Profile, {
      through: ProfileRol,
      foreignKey: 'id_rol',
      otherKey: 'id_profile',
      as: 'rols',
    });
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      isActive: this.is_active,
      createdAt: this.created_at,
      updatedAt: this.updated_at,
      // deletedAt: this.deleted_at,
    };
  }
}
/** Inicializar el modelo */
Rol.init(RolSchema, {
  paranoid: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
  sequelize: DB.connection(),
  tableName: 'rols',
});

export { RolSchema };
export default Rol;
