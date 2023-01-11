import psql from 'sequelize';
import DB from '../configs/DB/DB.mjs';
// eslint-disable-next-line import/no-cycle
import Rol from './RolModel.mjs';
// eslint-disable-next-line import/no-cycle
import User from './UserModel.mjs';
// eslint-disable-next-line import/no-cycle
import Modules from './ModuleModel.mjs';
import ProfileRol from './ProfileRolModel.mjs';
import ProfileModules from './ProfileModulesModel.mjs';

/** Definicion del modelo users */
const ProfileSchema = {
  id: {
    type: psql.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: { type: psql.Sequelize.STRING, allowNull: false, unique: true },
  description: { type: psql.Sequelize.STRING, allowNull: true },
  is_active: { type: psql.Sequelize.BOOLEAN, defaultValue: true },
};

class Profile extends psql.Model {
  /** crear relacion del modelo */
  static relationship() {
    this.belongsToMany(Rol, {
      through: ProfileRol,
      foreignKey: 'id_profile',
      otherKey: 'id_rol',
    });
    this.belongsToMany(Modules, {
      through: ProfileModules,
      foreignKey: 'id_profile',
      otherKey: 'id_module',
    });
    this.hasMany(User, { foreignKey: 'id_profile' });
  }

  static async getById(id) {
    return this.findOne({
      where: {
        id,
      },
      include: [
        {
          model: Rol,
          attributes: ['id', 'name'],
        },
        {
          model: Modules,
          attributes: ['id', 'name'],
        },
      ],
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
      deletedAt: this.deleted_at,
      rols: this.Rols,
      modules: this.Modules,
    };
  }
}
/** Inicializar el modelo */
Profile.init(ProfileSchema, {
  paranoid: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
  sequelize: DB.connection(),
  tableName: 'profiles',
});

export { ProfileSchema };
export default Profile;
