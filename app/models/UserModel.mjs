/* eslint-disable import/no-cycle */
import psql from 'sequelize';
import DB from '../DB/DB.mjs';
import RefreshToken from './RefreshTokenModel.mjs';
import Profile from './ProfileModel.mjs';

/** Definicion del modelo users */
const UserSchema = {
  id: {
    type: psql.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_profile: {
    type: psql.Sequelize.INTEGER,
    allowNull: false,
  },
  email: {
    type: psql.Sequelize.STRING,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: { type: psql.Sequelize.TEXT },
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
      attributes: ['id', 'email'],
      include: [{
        model: Profile,
        attributes: [],
      }],
    });
  }

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      profile: this.Profile,
    };
  }
}
/** Inicializar el modelo */
User.init(UserSchema, {
  timestamps: false,
  sequelize: DB.connection(),
  tableName: 'users',
});

export {
  UserSchema,
};
export default User;
