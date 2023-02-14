/* eslint-disable no-await-in-loop */
// import DB from '../configs/DB/DB.mjs';
import { Sequelize, Op } from 'sequelize';
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

  static findByName = async (name) => {
    const module = await Modules.findOne({
      where: Sequelize.where(
        Sequelize.fn('lower', Sequelize.col('name')),
        Sequelize.fn('lower', name)
      ),
    });

    return module;
  };

  static findByField = async (field, param) => {
    const module = await Modules.findOne({
      where: Sequelize.where(
        Sequelize.fn('lower', Sequelize.col(`${field}`)),
        Sequelize.fn('lower', param)
      ),
    });

    if (module) {
      throw new ErrorException(StatusCode.Bad_Request, `Module already exists with param ${param}`);
    }
  };

  /**
   * @param {*} id id
   * @param {*} field nombre de la columna (name, name_ruta, etc)
   * @param {*} param valor de la columna
   */
  static findInOtherModules = async (id, field, param) => {
    const module = await Modules.findOne({
      where: {
        [Op.and]: [
          { [Op.not]: [{ id }] },
          Sequelize.where(
            Sequelize.fn('lower', Sequelize.col(`${field}`)),
            Sequelize.fn('lower', param)
          ),
        ],
      },
    });

    if (module) throw new ErrorException(StatusCode.Bad_Request, `Module ${param} already exists`);
  };

  static checkModules = async (modules) => {
    for (let index = 0; index < modules.length; index += 1) {
      await this.findById(modules[index]);
    }
  };

  static getModulesProfile = async (profile) => {
    const modules = await Modules.findAll({
      attributes: ['id', 'name'],
      include: [
        {
          model: Profile,
          as: 'modules',
          where: { id: profile },
          attributes: [],
        },
      ],
    });

    return modules;
  };

  static deleteProfileModules = async (profile) => {
    const modules = await this.getModulesProfile(profile);
    for (let index = 0; index < modules.length; index += 1) {
      await ProfileModules.destroy({
        where: {
          id_profile: profile,
          id_module: modules[index].id,
        },
      });
    }
  };
}
