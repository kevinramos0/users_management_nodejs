import { Op } from 'sequelize';
import moment from 'moment-timezone';
import DB from '../DB/DB.mjs';
import isNumber from '../../utils/isNumber.mjs';
import Auth from '../../utils/GenerateToken.mjs';
import { encriptar, comparar } from '../../utils/EncryptPassword.mjs';
import StatusCode from '../../handlers/StatusCode.mjs';
import ErrorException from '../../handlers/ErrorExceptions.mjs';
import validateModel from '../../utils/ValidateModel.mjs';
import { User, Rol, Profile } from '../models/index.mjs';
// import getUserWithRols from '../../utils/getUserWithRols.mjs';
import getProfileWithRols from '../../utils/getProfileWithRols.mjs';
import { sendEmailConfirmUser, sendEmailResetPassword } from '../../utils/sendEmail.mjs';
import { verifyToken } from '../../utils/ValidateJWT.mjs';

export default class UserController {
  static getUsers = async (req, res) => {
    const {
      page = 1, per_page: perPage = 10, pagination = 'true', email, activo,
    } = req.query;
    const filter = {};
    const options = {};

    /** si se activa la paginacion validar campos numero */
    if (pagination === 'true') {
      await isNumber(page, 'Número de página debe ser un número entero');
      await isNumber(perPage, 'Cantidad por página debe ser un número entero');
      options.offset = perPage * (page - 1);
      options.limit = Number(perPage);
      options.distinct = true;
    }
    /** buscar por email */
    // eslint-disable-next-line no-unused-expressions
    email ? filter.email = { [Op.iLike]: `%${email}%` } : filter.email = { [Op.iLike]: '%%' };
    // if (!email) filter.email = { [Op.iLike]: '%%' };
    // eslint-disable-next-line no-unused-expressions
    activo ? filter.isActive = !(activo === 'false') : filter.isActive = { [Op.or]: ['false', 'true'] };

    const { rows: profiles, count: totalRows } = await Profile.findAndCountAll({
      ...options,
      where: {
        isActive: filter.isActive,
      },
      include: [
        {
          model: User,
          where: [
            { email: { ...filter.email } },
            // { id: { [Op.not]: 1 } },
          ],
        },
        {
          model: Rol,
          attributes: ['id', 'name'],
          through: {
            attributes: [],
          },
        },
      ],
      order: ['id'],
    });

    if (pagination === 'true') {
      res.set({
        total_rows: Number(totalRows),
        page: Number(page),
        per_page: Number(perPage),
      });
    }

    return res.status(StatusCode.OK).json(profiles);
  };

  static getOneUser = async (req, res) => {
    const { id } = req.params;
    await isNumber(id, 'El parametro Id debe ser un número entero');
    const user = await getProfileWithRols(id, 'El usuario no existe');
    if (!user.isActive) throw new ErrorException(StatusCode.NotFound, 'Usuario se encuentra inactivo');
    return res.status(StatusCode.OK).json(user);
  };

  static createUser = async (req, res) => {
    const connection = DB.connection();
    // transaction se usa para ejecutar la operacion solo si cumple todos las condiciones
    // si ocurre un error no realiza la operacion
    const t = await connection.transaction();
    const {
      firstName, lastName, phone, email, password,
    } = req.body;
    let { roles } = req.body;
    /** busca un usuario con ese email */
    const userExist = await User.findOne({ where: { email } });
    if (userExist) throw new ErrorException(StatusCode.Bad_Request, 'ya existe un usuario con ese email');
    let profileRoles;
    try {
      if (roles) {
        // eslint-disable-next-line no-plusplus
        for (let index = 0; index < roles.length; index++) {
          // eslint-disable-next-line no-await-in-loop
          const rolExist = await Rol.findByPk(roles[index]);
          if (!rolExist) throw new ErrorException(StatusCode.NotFound, 'No se encontró el rol');
        }

        profileRoles = await Rol.findAll({
          where: {
            id: roles,
          },
          attributes: ['id', 'name'],
        });
      }
      if (!roles) {
        profileRoles = await Rol.findOne({
          where: {
            name: 'Usuario',
          },
          attributes: ['id', 'name'],
        });
        roles = 1;
      }
      /** encriptar constraseña */
      const passwordEncripted = await encriptar(password);
      const profile = await Profile.create(
        {
          firstName,
          lastName,
          phone,
          isActive: false,
          create_at: moment().tz('America/El_Salvador').format(),
        },
        { transaction: t },
      );
      const user = await User.create(
        {
          id_profile: profile.id,
          email,
          password: passwordEncripted,
        },
        { transaction: t },
      );
      /** Agregar roles al usuario */
      await profile.addRols(roles, { transaction: t });

      // crear token email para confirmar cuenta
      const tokenEmail = await Auth.createEmailToken(profile.id);
      if (!tokenEmail) { throw new ErrorException(StatusCode.Bad_Request, 'No se pudo generar el token'); }

      // enviar correo de confirmacion
      await sendEmailConfirmUser(profile.firstName, user.email, tokenEmail);
      await t.commit();

      return res.status(StatusCode.Created).json({
        id: profile.id,
        firstName,
        lastName,
        phone,
        email: user.email,
        roles: profileRoles,
      });
    } catch (error) {
      await t.rollback();
      throw new ErrorException(StatusCode.Bad_Request, error.message);
    }
  };

  static editUser = async (req, res) => {
    const connection = DB.connection();
    // transaction se usa para ejecutar la operacion solo si cumple todos las condiciones
    // si ocurre un error no realiza la operacion
    const t = await connection.transaction();

    const { id } = req.params;
    const {
      firstName, lastName, phone, active, email, roles, password,
    } = req.body;

    await isNumber(id, 'El parametro Id debe ser un número entero');
    // buscar que el usuario a editar exista
    const profile = await validateModel(Profile, id, 'El perfil no existe');
    const userProfile = await getProfileWithRols(id, 'Usuario no encontrado');
    /** comparar password encriptada */
    const checkPassword = await comparar(password, userProfile.User.password);

    /** password no coincide */
    if (!checkPassword) throw new ErrorException(StatusCode.Bad_Request, 'Password Incorrecta');

    // buscar si cambio de email, que este no exista para otro usuario
    const emailExist = await User.findOne({
      where: {
        email,
        [Op.not]: [{ id }],
      },
    });
    if (emailExist) throw new ErrorException(StatusCode.Bad_Request, 'Este email ya existe');

    let profileRoles;
    try {
      if (roles) {
        // eslint-disable-next-line no-plusplus
        for (let index = 0; index < roles.length; index++) {
          // eslint-disable-next-line no-await-in-loop
          await validateModel(Rol, roles[index], 'No se encontró el rol');
        }

        profileRoles = await Rol.findAll({
          where: {
            id: roles,
          },
          attributes: ['id', 'name'],
        });
      }

      await Profile.update(
        {
          firstName,
          lastName,
          phone,
          isActive: active,
          updatedAt: moment().tz('America/El_Salvador').format(),
        },
        {
          where: {
            id,
          },
        },
        { transaction: t },
      );
      await User.update(
        {
          email,
        },
        {
          where: { id },
        },
        { transaction: t },
      );
      /** Agregar roles al usuario */
      await profile.addRols(roles, { transaction: t });

      await t.commit();

      return res.status(StatusCode.OK).json({
        id: profile.id,
        firstName,
        lastName,
        phone,
        isActive: active,
        email,
        roles: profileRoles,
      });
    } catch (error) {
      await t.rollback();
      throw new ErrorException(StatusCode.Bad_Request, error.message);
    }
  };

  static deleteUser = async (req, res) => {
    const { id } = req.params;
    await isNumber(id, 'El parametro Id debe ser un número entero');

    // buscar si el usuario existe la base de datos
    await validateModel(Profile, id, 'El perfil no existe');
    /**
     * Se hace un borrado logico del usuario
     * no se elimina realmente ya que se usa tabla paronica
     */
    await Profile.destroy({
      where: {
        id,
      },
    });
    res.status(StatusCode.OK).json({ message: 'Perfil eliminado correctamente' });
  };

  static changePassword = async (req, res) => {
    const { id } = req.params;
    await isNumber(id, 'El parametro Id debe ser un número entero');

    const { oldPassword, newPassword, confirmPassword } = req.body;
    const user = await validateModel(User, id, 'El usuario no existe');

    // buscar si el perfil no ha sido eliminado
    await validateModel(Profile, user.id_profile, 'Perfil no existe');
    // const user = await validateModel(User, id, 'El usuario no existe');

    const checkPassword = await comparar(oldPassword, user.password);
    /** old password no coincide */
    if (!checkPassword) { throw new ErrorException(StatusCode.Bad_Request, 'contraseña anterior incorrecta'); }
    /** old password === new passwrod */
    if (oldPassword === newPassword) {
      throw new ErrorException(
        StatusCode.Bad_Request,
        'la nueva contraseña no puede ser igual a la anterior',
      );
    }
    /** password  nueva no coincide */
    if (newPassword !== confirmPassword) { throw new ErrorException(StatusCode.Bad_Request, 'Confirmar contraseña no coincide'); }

    const newPasswordEncrypted = await encriptar(newPassword);
    await User.update(
      {
        password: newPasswordEncrypted,
      },
      {
        where: {
          id,
        },
      },
    );
    res.status(StatusCode.OK).json({ message: 'Password actualizada correctamente' });
  };

  static verifyAccount = async (req, res) => {
    const { token } = req.params;
    const compararToken = await verifyToken(token, process.env.EMAIL_TOKEN);
    if (!compararToken) { throw new ErrorException(StatusCode.Bad_Request, 'Token es valido'); }
    const { id } = compararToken;

    await Profile.update(
      {
        isActive: true,
        updatedAt: moment().tz('America/El_Salvador').format(),
      },
      {
        where: {
          id,
        },
      },
    );
    return res.status(StatusCode.OK).json({
      message: 'Usuario Activado Correctamente',
    });
  };

  static resetPassword = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({
      where: {
        email,
      },
    });
    if (!user) throw new ErrorException(StatusCode.Bad_Request, 'Email incorrecto');
    // crear token email para confirmar cuenta
    const tokenEmail = await Auth.createEmailToken(user.id);
    if (!tokenEmail) { throw new ErrorException(StatusCode.Bad_Request, 'No se pudo generar el token'); }

    // enviar correo de confirmacion
    await sendEmailResetPassword(user.email, tokenEmail);

    res.status(StatusCode.OK).json({ message: 'Correo enviado correctamente' });
  };

  static newPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    const compararToken = await verifyToken(token, process.env.EMAIL_TOKEN);
    if (!compararToken) throw new ErrorException(StatusCode.Bad_Request, 'Token es valido');

    // obtener usuario dueño del token
    const { id } = compararToken;

    // encriptar la nueva contraseña
    const passwordEncripted = await encriptar(password);

    // buscar y actualizar el usuario
    const user = await validateModel(User, id, 'No existe el usuario');
    await User.update(
      {
        password: passwordEncripted,
      },
      {
        where: {
          id: user.id,
        },
      },
    );

    res.status(StatusCode.OK).json('Se cambió la contraseña correctamente');
  };
}
