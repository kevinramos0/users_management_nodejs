import moment from 'moment-timezone';
import { encriptar } from '../utils/EncryptPassword.mjs';

// import DB from '../configs/DB/DB.mjs';
import ErrorException from '../configs/handlers/ErrorExceptions.mjs';
import StatusCode from '../configs/handlers/StatusCode.mjs';
import isNumber from '../utils/isNumber.mjs';
import { User } from '../models/index.mjs';

export default class UserService {
  static findById = async (id) => {
    await isNumber(id, 'id must be an integer');
    const user = await User.getById(id);
    if (!user) throw new ErrorException(StatusCode.NotFound, 'User not found');
    return user;
  };

  static findByEmail = async (email) => {
    const user = await User.findOne({ where: { email } });
    // if (!user) throw new ErrorException(StatusCode.NotFound, `user ${name} not found`);
    return user;
  };

  static updatePassword = async (id, password) => {
    // encriptar la nueva contraseña
    const passwordEncripted = await encriptar(password);

    // buscar y actualizar el usuario
    await User.update(
      {
        password: passwordEncripted,
        update_at: moment().tz('America/El_Salvador').format(),
      },
      {
        where: {
          id,
        },
      },
    );

    return {
      message: 'Your password has been updated successfully',
    };
  };
}
