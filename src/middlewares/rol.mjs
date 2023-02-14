import ErrorException from '../configs/handlers/ErrorExceptions.mjs';
import StatusCode from '../configs/handlers/StatusCode.mjs';
import { UserService, ProfileService } from '../services/index.mjs';
import Rols from '../utils/enumRoles.mjs';

const checkRole = (roles) => async (req, res, next) => {
  try {
    const user = await UserService.findById(req.user.id);
    const profile = await ProfileService.findById(user.profile.id);

    if (!profile.rols) throw new ErrorException(StatusCode.Forbidden, 'Forbidden');
    // obtener array de roles del usuario
    const namesRoles = profile.rols.map((rol) => rol.name);

    // comparar array de roles del perfil con roles que tienen acceso
    const filtro = [...namesRoles.filter((p) => roles.includes(p))];

    // no contiene ningun rol valido y no  es Admin
    if (filtro.length === 0 && !namesRoles.includes(Rols.admin)) {
      throw new ErrorException(StatusCode.Forbidden, 'Forbidden');
    }
    next();
  } catch (error) {
    next(error);
  }
};
export default checkRole;
