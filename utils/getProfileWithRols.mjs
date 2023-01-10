// import { Op } from 'sequelize';
import { User, Profile, Rol } from '../app/models/index.mjs';
import ErrorException from '../handlers/ErrorExceptions.mjs';
import StatusCode from '../handlers/StatusCode.mjs';

/**
 *
 * @param {Id o Email} param
 * @param {Texto en caso de No encontrar resultados} message
 * @returns Usuario con los roles asignados
 */
const getProfileWithRols = async (param, message = 'Usuario no existe') => {
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

  const profile = await Profile.findOne({
    where: { id: user.id_profile },
    include: [
      {
        model: Rol,
        attributes: ['id', 'name'],
        through: {
          attributes: [],
        },
      },
      {
        model: User,
      },
    ],
  });
  if (!profile) throw new ErrorException(StatusCode.NotFound, message);

  return profile;
};

export default getProfileWithRols;
