import moment from 'moment-timezone';

import DB from '../configs/DB/DB.mjs';
import ErrorException from '../configs/handlers/ErrorExceptions.mjs';
import StatusCode from '../configs/handlers/StatusCode.mjs';
import isNumber from '../utils/isNumber.mjs';
import { Profile, ProfileRol } from '../models/index.mjs';
import RolService from './rols.mjs';

export default class ProfileService {
  static findById = async (id) => {
    await isNumber(id, 'id must be an integer');
    const profile = await Profile.getById(id);
    if (!profile) throw new ErrorException(StatusCode.NotFound, 'Profile not found');
    return profile;
  };

  static findByName = async (name) => {
    const profile = await Profile.findOne({ where: { name } });
    // if (!profile) throw new ErrorException(StatusCode.NotFound, `Profile ${name} not found`);
    return profile;
  };

  static save = async (...profileData) => {
    const connection = DB.connection();
    // transaction se usa para ejecutar la operacion solo si cumple todos las condiciones
    // si ocurre un error no realiza la operacion
    const t = await connection.transaction();

    try {
      const profile = await Profile.create(
        {
          ...profileData,
          create_at: moment().tz('America/El_Salvador').format(),
        },
        { transaction: t },
      );

      await t.commit();

      return profile;
    } catch (error) {
      await t.rollback();
      throw new ErrorException(StatusCode.Bad_Request, error.message);
    }
  };

  static addRols = async (idProfile, rols = []) => {
    const connection = DB.connection();
    // transaction se usa para ejecutar la operacion solo si cumple todos las condiciones
    // si ocurre un error no realiza la operacion
    const t = await connection.transaction();

    try {
      // eslint-disable-next-line no-plusplus
      for (let index = 0; index < rols.length; index++) {
        // eslint-disable-next-line no-await-in-loop
        await RolService.findById(rols[index]);
      }

      // eslint-disable-next-line no-restricted-syntax
      for (const rol of rols) {
        // eslint-disable-next-line no-await-in-loop
        await ProfileRol.create(
          { id_profile: idProfile, id_rol: rol },
          {
            transaction: t,
          },
        );
      }
      await t.commit();
      return rols;
    } catch (error) {
      await t.rollback();
      throw new ErrorException(StatusCode.Bad_Request, error.message);
    }
  };
}
