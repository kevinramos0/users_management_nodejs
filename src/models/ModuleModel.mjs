import psql from 'sequelize';
import DB from '../configs/DB/DB.mjs';
// eslint-disable-next-line import/no-cycle
import Profile from './ProfileModel.mjs';
import ProfileModules from './ProfileModulesModel.mjs';

const ModuleSchema = {
  id: {
    type: psql.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: psql.Sequelize.STRING(50),
    allowNull: false,
  },
  name_ruta: {
    type: psql.Sequelize.STRING(50),
    allowNull: false,
    unique: true,
  },
  description: {
    type: psql.Sequelize.STRING(100),
    allowNull: true,
  },
  icon: {
    type: psql.Sequelize.STRING,
    allowNull: true,
  },
  is_active: {
    type: psql.Sequelize.BOOLEAN,
    defaultValue: true,
  },
  is_public: {
    type: psql.Sequelize.BOOLEAN,
    defaultValue: false,
  },
};
class Modules extends psql.Model {
  /** crear relacion del modelo */
  static relationship() {
    this.belongsToMany(Profile, {
      through: ProfileModules,
      foreignKey: 'id_module',
      otherKey: 'id_profile',
      as: 'modules',
    });
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      nameRoute: this.name_ruta,
      description: this.description,
      icon: this.icon,
      isActive: this.is_active,
      isPublic: this.is_public,
      createdAt: this.created_at,
      updatedAt: this.updated_at,
    };
  }
}
/** Inicializar el modelo */
Modules.init(ModuleSchema, {
  paranoid: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
  sequelize: DB.connection(),
  tableName: 'modules',
});

export { ModuleSchema };
export default Modules;
