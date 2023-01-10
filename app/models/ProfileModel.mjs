/* eslint-disable import/no-cycle */
import psql from 'sequelize';
import DB from '../DB/DB.mjs';
import Rol from './RolModel.mjs';
import User from './UserModel.mjs';
import ProfileRol from './ProfileRolModel.mjs';

/** Definicion del modelo users */
const ProfileSchema = {
  id: {
    type: psql.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  firstName: { type: psql.Sequelize.STRING },
  lastName: { type: psql.Sequelize.STRING },
  phone: { type: psql.Sequelize.STRING },
  isActive: { type: psql.Sequelize.BOOLEAN },
};

class Profile extends psql.Model {
  /** crear relacion del modelo */
  static relationship() {
    this.belongsToMany(Rol, {
      through: ProfileRol,
      foreignKey: 'id_profile',
      otherKey: 'id_rol',
    });
    this.hasOne(User, { foreignKey: 'id_profile' });
  }

  static async getById(id) {
    return this.findOne({
      where: {
        id,
      },
      attributes: ['id'],
      include: [
        {
          model: User,
          attributes: ['id', 'email'],
        },
        {
          model: Rol,
          attributes: ['id', 'name'],
        },
      ],
    });
  }

  toJSON() {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      phone: this.phone,
      isActive: this.isActive,
      user: this.User,
      roles: this.Rols,
    };
  }
}
/** Inicializar el modelo */
Profile.init(ProfileSchema, {
  paranoid: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deletedAt',
  sequelize: DB.connection(),
  tableName: 'profiles',
});

export {
  ProfileSchema,
};
export default Profile;
