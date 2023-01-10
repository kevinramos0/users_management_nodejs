// import { Op } from 'sequelize';
import { User } from '../app/models/index.mjs';
import ErrorException from '../handlers/ErrorExceptions.mjs';
import StatusCode from '../handlers/StatusCode.mjs';
import getProfileWithRols from './getProfileWithRols.mjs';

/**
 *
 * @param {Id o Email} param
 * @param {Texto en caso de No encontrar resultados} message
 * @returns Usuario con los roles asignados
 */
const getUserWithRols = async (param, message = 'Usuario no existe') => {
  const option = {};
  // si no es numero entero buscar por email
  const isNumber = param % 1 === 0;

  // eslint-disable-next-line radix, no-unused-expressions
  isNumber ? option.id = parseInt(param) : option.email = param;

  const user = await User.findOne({
    where: [
      { ...option },
      // { id: { [Op.not]: 1 } },
    ],
  });

  if (!user) throw new ErrorException(StatusCode.NotFound, message);

  const profile = await getProfileWithRols(user.id);
  if (!profile) throw new ErrorException(StatusCode.NotFound, message);

  const userWithRols = {
    user: profile.User,
    rols: profile.Rols,
  };

  return userWithRols;
};

export default getUserWithRols;
