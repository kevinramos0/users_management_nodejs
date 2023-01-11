import ErrorException from '../configs/handlers/ErrorExceptions.mjs';
import StatusCode from '../configs/handlers/StatusCode.mjs';
import { UserService, ProfileService } from '../services/index.mjs';

const checkProfile = (roles) => async (req, res, next) => {
  try {
    const user = await UserService.findById(req.user.id);
    const profile = await ProfileService.findById(user.Profile.id);

    // obtener array de roles del usuario
    const namesRoles = profile.map((rol) => rol.name);

    if (namesRoles.includes('Admin')) {
      next();
    }
    // comparar ambos array si no encuentra concidencia retornar error
    const filtro = [...namesRoles.filter((p) => roles.includes(p))];
    if (filtro.length === 0) throw new ErrorException(StatusCode.Forbidden, 'Forbidden');
    next();
  } catch (error) {
    next(error);
  }
};
export default checkProfile;
