import { Op } from 'sequelize';
import moment from 'moment-timezone';

import DB from '../configs/DB/DB.mjs';
import ErrorException from '../configs/handlers/ErrorExceptions.mjs';
import StatusCode from '../configs/handlers/StatusCode.mjs';
import isNumber from '../utils/isNumber.mjs';

import { Profile } from '../models/index.mjs';
import { ProfileService, RolService, ModuleService } from '../services/index.mjs';

export default class ProfileController {
  static findAll = async (req, res) => {
    const {
      limit = 10, offset = 1, pagination = 'true', name, active,
    } = req.query;
    const filter = {};
    const options = {};

    // por defecto entra a la condicion
    if (pagination === 'true') {
      await isNumber(offset, 'offset must be an integer');
      await isNumber(limit, 'limit must be an integer');
      options.offset = limit * (offset - 1);
      options.limit = limit;
      options.distinct = true;
    }

    // eslint-disable-next-line no-unused-expressions
    name ? (filter.name = { [Op.iLike]: `%${name}%` }) : (filter.name = { [Op.iLike]: '%%' });

    // if (!name) filter.name = { [Op.iLike]: '%%' };
    // eslint-disable-next-line no-unused-expressions
    active
      ? (filter.isActive = !(active === 'false'))
      : (filter.isActive = { [Op.or]: ['false', 'true'] });

    const { rows: profiles, count: total } = await Profile.findAndCountAll({
      ...options,
      where: {
        name: filter.name,
        is_active: filter.isActive,
      },
      order: ['id'],
    });

    // if (pagination === 'true') {
    //   res.set({
    //     pagination: {
    //       limit,
    //       offset,
    //       total,
    //     },
    //   });
    // }

    return res.status(StatusCode.OK).json({
      profiles,
      pagination: {
        limit: pagination === 'true' ? +limit : +total,
        offset: pagination === 'true' ? +offset : 1,
        total,
      },
    });
  };

  static findOne = async (req, res) => {
    const { id } = req.params;
    const profile = await ProfileService.findById(id);

    return res.status(StatusCode.OK).json(profile);
  };

  static create = async (req, res) => {
    const {
      name, description, rols, modules,
    } = req.body;

    const profileExists = await ProfileService.findByName(name);
    if (profileExists) {
      throw new ErrorException(StatusCode.Bad_Request, `Profile ${name} already exists`);
    }

    const connection = DB.connection();
    // transaction se usa para ejecutar la operacion solo si cumple todos las condiciones
    // si ocurre un error no realiza la operacion
    const t = await connection.transaction();

    try {
      // verificar que existan los roles y/o modulos
      if (modules) await ModuleService.checkModules(modules);
      if (rols) await RolService.checkRols(rols);

      const newProfile = await Profile.create(
        {
          name,
          description,
          create_at: moment().tz('America/El_Salvador').format(),
        },
        { transaction: t },
      );

      /** Agregar roles al perfil */
      if (rols) await newProfile.addRols(rols, { transaction: t });

      /** Agregar modulos al perfil */
      if (modules) await newProfile.addModules(modules, { transaction: t });

      await t.commit();
      const profile = await ProfileService.findById(newProfile.id);
      return res.status(StatusCode.Created).json(profile);
    } catch (error) {
      await t.rollback();
      throw new ErrorException(StatusCode.Bad_Request, error.message);
    }
  };

  static update = async (req, res) => {
    const { id } = req.params;
    const {
      name, description, isActive, rols, modules,
    } = req.body;

    const profile = await ProfileService.findById(id);

    // si se cambia el nombre buscar que no exista otro perfil con ese nombre
    if (name) {
      const nameExists = await Profile.findOne({
        where: { name, [Op.not]: [{ id }] },
      });

      if (nameExists) {
        throw new ErrorException(StatusCode.Bad_Request, `Profile ${name} already exists`);
      }
    }

    const connection = DB.connection();
    const t = await connection.transaction();

    try {
      /** borrar antiguos, verificar nuevos, agregar nuevos */
      if (rols) {
        await RolService.deleteProfileRols(id);
        await RolService.checkRols(rols);
        await profile.addRols(rols, { transaction: t });
      }
      if (modules) {
        await ModuleService.deleteProfileModules(id);
        await ModuleService.checkModules(modules);
        await profile.addModules(modules, { transaction: t });
      }

      await Profile.update(
        {
          name,
          description,
          is_active: isActive,
          updatedAt: moment().tz('America/El_Salvador').format(),
        },
        {
          where: {
            id,
          },
        },
        { transaction: t },
      );
      await t.commit();

      const profileData = await Profile.getById(id);
      return res.status(StatusCode.Created).json(profileData);
    } catch (error) {
      await t.rollback();
      throw new ErrorException(StatusCode.Bad_Request, error.message);
    }
  };

  static delete = async (req, res) => {
    const { id } = req.params;
    await ProfileService.findById(id);

    await Profile.destroy({
      where: { id },
    });

    res.status(StatusCode.OK).json({
      message: 'Profile deleted successfully',
    });
  };
}
