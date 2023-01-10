import psql from 'sequelize';
import DB from '../DB/DB.mjs';
// eslint-disable-next-line import/no-cycle
import User from './UserModel.mjs';

class RefreshToken extends psql.Model {
  static relationship() {
    this.belongsTo(User, { foreignKey: 'id_user' });
  }
}

RefreshToken.init({
  id: {
    type: psql.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  refresh_token: {
    type: psql.Sequelize.STRING,
  },
  id_user: {
    type: psql.Sequelize.INTEGER,
    allowNull: false,
  },
  dateValid: {
    type: psql.Sequelize.DATE,
  },
}, {
  timestamps: false,
  sequelize: DB.connection(),
  tableName: 'refresh_token',
});

export default RefreshToken;
