import moment from 'moment-timezone';
import { comparar } from '../../utils/EncryptPassword.mjs';
import Auth from '../../utils/GenerateToken.mjs';
import { RefreshToken, User } from '../models/index.mjs';
import StatusCode from '../../handlers/StatusCode.mjs';
import ErrorException from '../../handlers/ErrorExceptions.mjs';
import getProfileWithRols from '../../utils/getProfileWithRols.mjs';

export default class authController {
  static login = async (req, res) => {
    const { email, password } = req.body;

    const profile = await getProfileWithRols(email, 'No existe un usuario con ese email');

    /** existe el usuario pero está inactivo */
    if (!profile.isActive) throw new ErrorException(StatusCode.Bad_Request, 'Usuario inactivo, por favor confirme su email');

    /** comparar password encriptada */
    const checkPassword = await comparar(password, profile.User.password);

    /** password no coincide */
    if (!checkPassword) throw new ErrorException(StatusCode.Bad_Request, 'Password Incorrecta');

    /** crear Token para el usuario */
    const tokenJwt = await Auth.createToken(profile.User.id);
    /** crear refresh_token */
    const tokenRefresh = await Auth.refresh_token(profile.User.id);

    return res.status(StatusCode.OK).json({
      profile,
      token: tokenJwt,
      tokenRefresh,
    });
  };

  static refresh = async (req, res) => {
    const { tokenRefresh } = req.body;
    if (!tokenRefresh) throw new ErrorException(StatusCode.Bad_Request, 'El campo tokenRefresh es requerido');

    const refreshToken = await RefreshToken.findOne({ where: { refresh_token: tokenRefresh } });
    if (!refreshToken) throw new ErrorException(StatusCode.Bad_Request, 'token invalido');

    const dateToken = moment(refreshToken.dateValid).valueOf();
    const DateNow = moment().tz('America/El_Salvador').valueOf();
    if (dateToken < DateNow) throw new ErrorException(StatusCode.Bad_Request, 'Token Expirado');

    // obtener el usuario dueño de este token
    const user = await User.findByPk(refreshToken.id_user);
    if (!user) throw new ErrorException(StatusCode.NotFound, 'Usuario no encontrado');

    const token = await Auth.createToken(user.id);
    // const newRefreshToken = await Auth.refresh_token(user.id);

    // await refreshToken.update({
    //   refresh_token: newRefreshToken,
    //   dateValid: moment()
    //     .add(process.env.TIME_TOKEN_REFRESH, process.env.TYPE_TIME_TOKEN_REFRES)
    //     .tz('America/El_Salvador')
    //     .format(),
    // });

    res.status(StatusCode.OK).json({
      token,
    });
  };

  static logout = async (req, res) => {
    await RefreshToken.destroy({
      where: {
        id_user: req.usuario.id,
      },
    });

    return res.status(StatusCode.OK).json();
  };
}
