/* eslint-disable no-await-in-loop */
// import DB from '../configs/DB/DB.mjs';
import { Sequelize, Op } from 'sequelize';
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

  static findByName = async (name) => {
    const rol = await Rol.findOne({
      where: Sequelize.where(
        Sequelize.fn('lower', Sequelize.col('name')),
        Sequelize.fn('lower', name)
      ),
    });

    return rol;
  };

  static findNameInOthersRols = async (id, name) => {
    const rol = await Rol.findOne({
      where: {
        [Op.and]: [
          { [Op.not]: [{ id }] },
          Sequelize.where(
            Sequelize.fn('lower', Sequelize.col('name')),
            Sequelize.fn('lower', name)
          ),
        ],
      },
    });

    if (rol) throw new ErrorException(StatusCode.Bad_Request, `Rol ${name} already exists`);
  };

  static checkRols = async (rols) => {
    for (let index = 0; index < rols.length; index += 1) {
      await this.findById(rols[index]);
    }
  };

  static getRolsToProfile = async (profile) => {
    const rols = await Rol.findAll({
      attributes: ['id', 'name'],
      include: [
        {
          model: Profile,
          as: 'rols',
          where: { id: profile },
          attributes: [],
        },
      ],
    });

    return rols;
  };

  static deleteProfileRols = async (profile) => {
    const rols = await this.getRolsToProfile(profile);
    for (let index = 0; index < rols.length; index += 1) {
      await ProfileRol.destroy({
        where: {
          id_profile: profile,
          id_rol: rols[index].id,
        },
      });
    }
  };
}
