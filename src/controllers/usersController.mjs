import { Op } from 'sequelize';
import moment from 'moment-timezone';

import DB from '../configs/DB/DB.mjs';
import { encriptar, comparar } from '../utils/EncryptPassword.mjs';
import ErrorException from '../configs/handlers/ErrorExceptions.mjs';
import StatusCode from '../configs/handlers/StatusCode.mjs';
import isNumber from '../utils/isNumber.mjs';

import { User, Profile } from '../models/index.mjs';
import { UserService, ProfileService } from '../services/index.mjs';

export default class UserController {
  static findAll = async (req, res) => {
    const { limit = 10, offset = 1, pagination = 'true', email, active } = req.query;
    const filter = {};
    const options = {};

    // por defecto entra a la condicion
    if (pagination === 'true') {
      await isNumber(offset, 'offset must be an integer');
      await isNumber(limit, 'limit must be an integer');
      options.offset = limit * (offset - 1);
      options.limit = limit;
      options.distinct = true;
    }
    /** buscar por email */
    // eslint-disable-next-line no-unused-expressions
    email ? (filter.email = { [Op.iLike]: `%${email}%` }) : (filter.email = { [Op.iLike]: '%%' });
    // if (!email) filter.email = { [Op.iLike]: '%%' };
    // eslint-disable-next-line no-unused-expressions
    active
      ? (filter.isActive = !(active === 'false'))
      : (filter.isActive = { [Op.or]: ['false', 'true'] });

    const { rows: users, count: total } = await User.findAndCountAll({
      ...options,
      where: {
        email: filter.email,
        is_active: filter.isActive,
      },
      include: [
        {
          model: Profile,
          attributes: ['id', 'name'],
        },
      ],
      order: ['id'],
    });

    return res.status(StatusCode.OK).json({
      users,
      pagination: {
        limit: pagination === 'true' ? +limit : +total,
        offset: pagination === 'true' ? +offset : 1,
        total,
      },
    });
  };

  static findOne = async (req, res) => {
    const { id } = req.params;
    const user = await UserService.findById(id);
    return res.status(StatusCode.OK).json(user);
  };

  static createUser = async (req, res) => {
    const { email, password, profile } = req.body;

    /** busca un usuario con ese email */
    await UserService.findByEmail(email);

    if (profile) {
      await ProfileService.findById(profile);
    }
    const connection = DB.connection();
    // transaction se usa para ejecutar la operacion solo si cumple todos las condiciones
    // si ocurre un error no realiza la operacion
    const t = await connection.transaction();

    try {
      /** encriptar constraseña */
      const passwordEncripted = await encriptar(password);

      const user = await User.create(
        {
          email,
          password: passwordEncripted,
          is_active: true,
          is_verified: false,
          id_profile: profile,
          create_at: moment().tz('America/El_Salvador').format(),
        },
        { transaction: t }
      );

      await t.commit();
      const userData = await UserService.findById(user.id);
      return res.status(StatusCode.Created).json(userData);
    } catch (error) {
      await t.rollback();
      throw new ErrorException(StatusCode.Bad_Request, error.message);
    }
  };

  static editUser = async (req, res) => {
    const { id } = req.params;

    const { email, isActive, isVerified, profile } = req.body;

    await UserService.findById(id);

    const connection = DB.connection();
    // transaction se usa para ejecutar la operacion solo si cumple todos las condiciones
    // si ocurre un error no realiza la operacion
    const t = await connection.transaction();

    try {
      // /** comparar password encriptada */
      // const checkPassword = await comparar(password, userProfile.User.password);

      // /** password no coincide */
      // if (!checkPassword) throw new ErrorException(StatusCode.Bad_Request, 'Password Incorrecta');

      if (email) {
        // buscar si cambio de email, que este no exista para otro usuario
        await UserService.findEmailInOthersUsers(id, email);
      }

      if (profile) await ProfileService.findById(profile);

      await User.update(
        {
          email,
          is_active: isActive,
          is_verified: isVerified,
          id_profile: profile,
        },
        {
          where: { id },
        },
        { transaction: t }
      );

      await t.commit();

      const user = await User.getById(id);

      return res.status(StatusCode.OK).json(user);
    } catch (error) {
      await t.rollback();
      throw new ErrorException(StatusCode.Bad_Request, error.message);
    }
  };

  static deleteUser = async (req, res) => {
    const { id } = req.params;

    await UserService.findById(id);

    await User.destroy({
      where: {
        id,
      },
    });
    res.status(StatusCode.OK).json({ message: 'User deleted successfully' });
  };

  static changePassword = async (req, res) => {
    const { id } = req.user;
    const { oldPassword, newPassword } = req.body;

    const user = await User.findByPk(id);

    // Check old password
    await comparar(oldPassword, user.password, "Current password doesn't match");

    if (oldPassword === newPassword) {
      throw new ErrorException(
        StatusCode.Bad_Request,
        "the new password can't be the same as the current password"
      );
    }
    const updatePassword = await UserService.updatePassword(id, newPassword);

    return res.status(StatusCode.OK).json(updatePassword);
  };
}
