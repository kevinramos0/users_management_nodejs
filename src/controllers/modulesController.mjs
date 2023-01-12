import { Op } from 'sequelize';
import moment from 'moment-timezone';

import StatusCode from '../configs/handlers/StatusCode.mjs';
import isNumber from '../utils/isNumber.mjs';
import { Modules } from '../models/index.mjs';
import { ModuleService } from '../services/index.mjs';

export default class ModulesController {
  static findAll = async (req, res) => {
    const {
      pagination = 'true', limit = 10, offset = 1, name, active,
    } = req.query;

    const filter = {};
    const options = {};

    if (pagination === 'true') {
      await isNumber(limit, 'limit must be a integer');
      await isNumber(offset, 'offset must be a integer');
      options.limit = limit;
      options.offset = limit * (offset - 1);
      options.distinct = true;
    }

    // eslint-disable-next-line no-unused-expressions
    name ? (filter.name = { [Op.iLike]: `%${name}%` }) : (filter.name = { [Op.iLike]: '%%' });

    // eslint-disable-next-line no-unused-expressions
    active
      ? (filter.isActive = !(active === 'false'))
      : (filter.isActive = { [Op.or]: ['false', 'true'] });

    const { rows: modules, count: total } = await Modules.findAndCountAll({
      ...options,
      where: {
        name: filter.name,
        is_active: filter.isActive,
      },
      order: [['name', 'ASC']],
    });

    return res.status(StatusCode.OK).json({
      modules,
      pagination: {
        limit: pagination === 'true' ? +limit : +total,
        offset: pagination === 'true' ? +offset : 1,
        total,
      },
    });
  };

  static findOne = async (req, res) => {
    const { id } = req.params;

    const module = await ModuleService.findById(id);
    return res.status(StatusCode.OK).json(module);
  };

  static create = async (req, res) => {
    const {
      name, nameRuta, icon, description, isPublic,
    } = req.body;

    // buscar si existe otro modulo con ese nombre, ruta
    await ModuleService.findByField('name', name);
    await ModuleService.findByField('name_ruta', nameRuta);

    const module = await Modules.create({
      name,
      name_ruta: nameRuta,
      icon,
      description,
      is_public: isPublic,
      is_active: true,
      created_at: moment().tz('America/El_Salvador').format(),
    });

    return res.status(StatusCode.Created).json(module);
  };

  static update = async (req, res) => {
    const { id } = req.params;
    const {
      name, nameRuta, icon, description, isActive, isPublic,
    } = req.body;

    // verifcar que exista el modulo con ese nombre id
    await ModuleService.findById(id);

    // check que no exista otro modulo con el nuevo nombre
    if (name) await ModuleService.findInOtherModules(id, 'name', name);

    if (nameRuta) await ModuleService.findInOtherModules(id, 'name_ruta', nameRuta);

    await Modules.update(
      {
        name,
        name_ruta: nameRuta,
        icon,
        description,
        is_active: isActive,
        is_public: isPublic,
        updated_at: moment().tz('America/El_Salvador').format(),
      },
      {
        where: { id },
      },
    );
    const module = await ModuleService.findById(id);

    return res.status(StatusCode.OK).json(module);
  };

  static delete = async (req, res) => {
    const { id } = req.params;
    await ModuleService.findById(id);

    await Modules.destroy({ where: { id } });

    return res.status(StatusCode.OK).json({
      message: 'Module deleted successfully',
    });
  };
}
