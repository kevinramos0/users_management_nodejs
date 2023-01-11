// import DB from '../configs/DB/DB.mjs';
import ErrorException from '../configs/handlers/ErrorExceptions.mjs';
import StatusCode from '../configs/handlers/StatusCode.mjs';
import isNumber from '../utils/isNumber.mjs';
import { Rol, Profile, ProfileRol } from '../models/index.mjs';

export default class RolService {
  static findById = async (id) => {
    await isNumber(id, 'id must be an integer');
    const rol = await Rol.findByPk(id);
    if (!rol) throw new ErrorException(StatusCode.NotFound, 'Not found rol');
    return rol;
  };

  static checkRols = async (rols) => {
    // eslint-disable-next-line no-plusplus
    for (let index = 0; index < rols.length; index++) {
      // eslint-disable-next-line no-await-in-loop
      await this.findById(rols[index]);
    }
  };

  static getRolsToProfile = async (profile) => {
    const rols = await Rol.findAll({
      attributes: ['id', 'name'],
      include: [{
        model: Profile,
        where: { id: profile },
        attributes: [],
      }],
    });

    return rols;
  };

  static deleteProfileRols = async (profile) => {
    const rols = await this.getRolsToProfile(profile);
    // eslint-disable-next-line no-plusplus
    for (let index = 0; index < rols.length; index++) {
      // eslint-disable-next-line no-await-in-loop
      await ProfileRol.destroy({
        where: {
          id_profile: profile,
          id_rol: rols[index].id,
        },
      });
    }
  };
}
