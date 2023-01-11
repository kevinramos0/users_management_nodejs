// import DB from '../configs/DB/DB.mjs';
import ErrorException from '../configs/handlers/ErrorExceptions.mjs';
import StatusCode from '../configs/handlers/StatusCode.mjs';
import isNumber from '../utils/isNumber.mjs';
import { Modules, ProfileModules, Profile } from '../models/index.mjs';

export default class ModuleService {
  static findById = async (id) => {
    await isNumber(id, 'id must be an integer');
    const module = await Modules.findByPk(id);
    if (!module) throw new ErrorException(StatusCode.NotFound, 'Module not found');
    return module;
  };

  static checkModules = async (modules) => {
    // eslint-disable-next-line no-plusplus
    for (let index = 0; index < modules.length; index++) {
      // eslint-disable-next-line no-await-in-loop
      await this.findById(modules[index]);
    }
  };

  static getModulesProfile = async (profile) => {
    const modules = await Modules.findAll({
      attributes: ['id', 'name'],
      include: [{
        model: Profile,
        where: { id: profile },
        attributes: [],
      }],
    });

    return modules;
  };

  static deleteProfileModules = async (profile) => {
    const modules = await this.getModulesProfile(profile);
    // eslint-disable-next-line no-plusplus
    for (let index = 0; index < modules.length; index++) {
      // eslint-disable-next-line no-await-in-loop
      await ProfileModules.destroy({
        where: {
          id_profile: profile,
          id_module: modules[index].id,
        },
      });
    }
  };
}
