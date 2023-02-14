import moment from 'moment-timezone';

import ErrorException from '../configs/handlers/ErrorExceptions.mjs';
import StatusCode from '../configs/handlers/StatusCode.mjs';
import Auth from '../utils/GenerateToken.mjs';
import { comparar } from '../utils/EncryptPassword.mjs';
import { verifyToken } from '../utils/ValidateJWT.mjs';
import { sendEmailVerifyUser, sendEmailResetPassword } from '../utils/sendEmail.mjs';
import '../configs/env.mjs';

import { RefreshToken, User, Profile } from '../models/index.mjs';
import { UserService } from '../services/index.mjs';

export default class authController {
  static login = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: Profile,
          as: 'profile',
          attributes: ['id', 'is_active'],
        },
      ],
    });

    if (!user) throw new ErrorException(StatusCode.NotFound, `User with email ${email} not found`);
    /** usuario inactivo */
    if (!user.is_active) {
      throw new ErrorException(StatusCode.Bad_Request, `User ${email} is inactive`);
    }

    /** usuario no verificado */
    if (!user.is_verified) {
      const tokenEmail = await Auth.createEmailToken(user.id);
      if (!tokenEmail) {
        throw new ErrorException(StatusCode.Bad_Request, 'Failed to generate token');
      }

      // enviar correo de confirmacion
      await sendEmailVerifyUser(user.email, tokenEmail);

      return res
        .status(StatusCode.Bad_Request)
        .json({ message: `Please check the email ${user.email} for verify your account` });
    }

    if (!user.profile || !user.profile.is_active) {
      throw new ErrorException(StatusCode.Bad_Request, "User don't have a profile valid assigned");
    }

    /** comparar password encriptada */
    await comparar(password, user.password);

    /** crear Token para el usuario */
    const token = await Auth.createToken(user.id);
    /** crear refresh_token */
    const refreshToken = await Auth.refresh_token(user.id);

    return res.status(StatusCode.OK).json({
      user,
      token,
      refreshToken,
    });
  };

  static restorePassword = async (req, res) => {
    const { email } = req.body;

    if (!email) throw new ErrorException(StatusCode.Bad_Request, 'Email is required');

    const user = await UserService.findByEmail(email);
    if (!user) throw new ErrorException(StatusCode.NotFound, 'User not found');

    const token = await Auth.createEmailToken(user.id);
    if (!token) {
      throw new ErrorException(StatusCode.Bad_Request, 'Failed to generate token');
    }

    // enviar correo de confirmacion
    await sendEmailResetPassword(user.email, token);

    // return res.status(StatusCode.OK).json({ token });
    return res
      .status(StatusCode.OK)
      .json({ message: `please check your email ${email} for change your password` });
  };

  static saveNewPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const validToken = await verifyToken(token, process.env.EMAIL_TOKEN);
    if (!validToken) {
      throw new ErrorException(StatusCode.Bad_Request, 'Token invalid');
    }
    // obtener id usuario dueño del token
    const { id } = validToken;
    // await UserService.findById(id);

    const updatePassword = await UserService.updatePassword(id, password);

    return res.status(StatusCode.OK).json(updatePassword);
  };

  static refreshToken = async (req, res) => {
    const { refreshToken } = req.params;
    if (!refreshToken) {
      throw new ErrorException(StatusCode.Bad_Request, 'tokenRefresh is required');
    }

    const getToken = await RefreshToken.findOne({ where: { refresh_token: refreshToken } });
    if (!getToken) throw new ErrorException(StatusCode.Bad_Request, 'token invalid');

    const dateToken = moment(getToken.date_valid).valueOf();
    const DateNow = moment().tz('America/El_Salvador').valueOf();
    if (dateToken < DateNow) {
      throw new ErrorException(StatusCode.Bad_Request, 'Token expired, please sign in again');
    }

    // obtener el usuario dueño de este token
    const user = await User.findByPk(getToken.id_user);
    if (!user) throw new ErrorException(StatusCode.NotFound, 'User not found');

    const token = await Auth.createToken(user.id);
    // const newRefreshToken = await Auth.refresh_token(user.id);

    res.status(StatusCode.OK).json({
      token,
    });
  };

  static verifyUser = async (req, res) => {
    const { token } = req.params;

    const validToken = await verifyToken(token, process.env.EMAIL_TOKEN);
    if (!validToken) {
      throw new ErrorException(StatusCode.Bad_Request, 'Token invalid');
    }
    const { id } = validToken;

    await User.update(
      {
        is_verified: true,
        updatedAt: moment().tz('America/El_Salvador').format(),
      },
      {
        where: {
          id,
        },
      }
    );
    return res.status(StatusCode.OK).json({
      message: 'User verified successfully',
    });
  };

  static logout = async (req, res) => {
    await RefreshToken.destroy({
      where: {
        id_user: req.user.id,
      },
    });

    return res.status(StatusCode.OK).json();
  };
}
