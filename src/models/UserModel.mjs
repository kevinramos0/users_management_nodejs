/* eslint-disable import/no-cycle */
import psql from 'sequelize';
import DB from '../configs/DB/DB.mjs';
import RefreshToken from './RefreshTokenModel.mjs';
import Profile from './ProfileModel.mjs';

/** Definicion del modelo users */
const UserSchema = {
  id: {
    type: psql.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: psql.Sequelize.STRING,
    unique: true,
    validate: {
      isEmail: true,
    },
    allowNull: false,
  },
  password: { type: psql.Sequelize.TEXT, allowNull: false },
  is_active: { type: psql.Sequelize.BOOLEAN, defaultValue: true },
  is_verified: { type: psql.Sequelize.BOOLEAN, defaultValue: false },
  id_profile: { type: psql.Sequelize.INTEGER, allowNull: true },
};

class User extends psql.Model {
  /** crear relacion del modelo */
  static relationship() {
    this.belongsTo(Profile, { foreignKey: 'id_profile' });
    this.hasOne(RefreshToken, { foreignKey: 'id_user' });
  }

  static async getById(id) {
    return this.findOne({
      where: {
        id,
      },
      attributes: { exclude: ['password'] },
      include: [{
        model: Profile,
        attributes: ['id', 'name'],
      }],
    });
  }

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      isActive: this.is_active,
      isVerified: this.is_verified,
      profile: this.Profile,
      createdAt: this.created_at,
      updatedAt: this.updated_at,
      deletedAt: this.deleted_at,
    };
  }
}
/** Inicializar el modelo */
User.init(UserSchema, {
  paranoid: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
  sequelize: DB.connection(),
  tableName: 'users',
});

export {
  UserSchema,
};
export default User;
