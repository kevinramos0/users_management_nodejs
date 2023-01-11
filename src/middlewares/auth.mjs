import moment from 'moment-timezone';
import { verifyToken, decodeSign } from '../utils/ValidateJWT.mjs';
import StatusCode from '../configs/handlers/StatusCode.mjs';
import { User, RefreshToken } from '../models/index.mjs';

// export default class ChechAuth {
// eslint-disable-next-line consistent-return
const ChechAuth = async (req, res, next) => {
  try {
    // buscar el la cabezera de la solicitud si posee token
    let { authorization } = req.headers;
    if (!authorization) { return res.status(StatusCode.Unauthenticated).json({ message: 'Unauthenticated' }); }

    // si encuentra debe poseer numero de token y nombre token
    authorization = authorization.split(' ');
    if (authorization.length < 2) { return res.status(StatusCode.Unauthenticated).json({ message: 'Unauthenticated' }); }

    // obtener solo numero de token y comparar
    const token = authorization[1];
    // obtener usuario asociado al token
    const validToken = await verifyToken(token, process.env.JWT_SECRET);
    if (!validToken) { return res.status(StatusCode.Unauthenticated).json({ message: 'Token invalid' }); }

    // buscar si existe el usuario que realiza la solicitud
    const user = await User.findOne({ where: { id: validToken.id } });
    if (!user) return res.status(StatusCode.Unauthenticated).json({ message: 'User not found' });

    // verificar si existe el refresh token
    const existRefreskToken = await RefreshToken.findOne({
      where: { id_user: user.id },
      order: ['id', 'DESC'],
    });
    if (!existRefreskToken) { return res.status(StatusCode.Unauthenticated).json({ message: 'refresh Token invalid' }); }

    // verificar que la fecha del refresh token aún sea válida
    const dateToken = moment(existRefreskToken.date_valid).valueOf();
    const DateNow = moment().tz('America/El_Salvador').valueOf();
    if (dateToken < DateNow) { res.status(StatusCode.Unauthenticated).json({ message: 'Token expired' }); }

    const decoded = await decodeSign(token);
    if (!decoded) { return res.status(StatusCode.Unauthenticated).json({ message: 'Unauthenticated' }); }

    // agregar usuario a request para acceder a su info en los controllers
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export default ChechAuth;
