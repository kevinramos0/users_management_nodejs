import { Op } from 'sequelize';
import moment from 'moment-timezone';

import StatusCode from '../configs/handlers/StatusCode.mjs';
import isNumber from '../utils/isNumber.mjs';
import { Rol } from '../models/index.mjs';
import { RolService } from '../services/index.mjs';
import ErrorException from '../configs/handlers/ErrorExceptions.mjs';

export default class RolsController {
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

    const { rows: rols, count: total } = await Rol.findAndCountAll({
      ...options,
      where: {
        name: filter.name,
        is_active: filter.isActive,
      },
      order: [['name', 'ASC']],
    });

    return res.status(StatusCode.OK).json({
      rols,
      pagination: {
        limit: pagination === 'true' ? +limit : +total,
        offset: pagination === 'true' ? +offset : 1,
        total,
      },
    });
  };

  static findOne = async (req, res) => {
    const { id } = req.params;

    const rol = await RolService.findById(id);
    return res.status(StatusCode.OK).json(rol);
  };

  static create = async (req, res) => {
    const { name, description } = req.body;

    // buscar si existe otro rol con ese nombre
    const existRol = await RolService.findByName(name);
    if (existRol) throw new ErrorException(StatusCode.Bad_Request, `Rol ${name} already exists`);

    const rol = await Rol.create({
      name,
      description,
      is_active: true,
      created_at: moment().tz('America/El_Salvador').format(),
    });

    return res.status(StatusCode.Created).json(rol);
  };

  static update = async (req, res) => {
    const { id } = req.params;
    const { name, description, isActive } = req.body;

    // verificar que exista el rol con ese nombre id
    await RolService.findById(id);

    // check que no exista otro rol con el nuevo nombre
    if (name) {
      await RolService.findNameInOthersRols(id, name);
    }

    await Rol.update(
      {
        name,
        description,
        is_active: isActive,
        updated_at: moment().tz('America/El_Salvador').format(),
      },
      {
        where: { id },
      },
    );

    const rolData = await RolService.findById(id);

    return res.status(StatusCode.OK).json(rolData);
  };

  static delete = async (req, res) => {
    const { id } = req.params;
    await RolService.findById(id);

    await Rol.destroy({ where: { id } });

    return res.status(StatusCode.OK).json({
      message: 'Rol deleted successfully',
    });
  };
}
