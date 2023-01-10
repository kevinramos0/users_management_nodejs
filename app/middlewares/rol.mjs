import ErrorException from '../../handlers/ErrorExceptions.mjs';
import StatusCode from '../../handlers/StatusCode.mjs';
import getUserWithRols from '../../utils/getUserWithRols.mjs';

const checkRole = (roles) => async (req, res, next) => {
  try {
    const userRols = await getUserWithRols(req.usuario.id, 'No se encontró el usuario');

    // obtener array de roles del usuario
    const namesRoles = userRols.rols.map((rol) => rol.name);
    // comparar ambos array si no encuentra concidencia retornar error
    const filtro = [...namesRoles.filter((p) => roles.includes(p))];
    if (filtro.length === 0) throw new ErrorException(StatusCode.Forbidden, 'Acceso Restringido');
    next();
  } catch (error) {
    next(error);
  }
};
export default checkRole;
