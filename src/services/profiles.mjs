import { Sequelize, Op } from 'sequelize';

import ErrorException from '../configs/handlers/ErrorExceptions.mjs';
import StatusCode from '../configs/handlers/StatusCode.mjs';
import isNumber from '../utils/isNumber.mjs';
import { Profile } from '../models/index.mjs';

export default class ProfileService {
  static findById = async (id) => {
    await isNumber(id, 'id must be an integer');
    const profile = await Profile.getById(id);
    if (!profile) throw new ErrorException(StatusCode.NotFound, 'Profile not found');
    return profile;
  };

  static findByName = async (name) => {
    const profile = await Profile.findOne({
      where: Sequelize.where(
        Sequelize.fn('lower', Sequelize.col('name')),
        Sequelize.fn('lower', name)
      ),
    });
    // if (!profile) throw new ErrorException(StatusCode.NotFound, `Profile ${name} not found`);
    return profile;
  };

  static findNameInOthersProfiles = async (id, name) => {
    const profile = await Profile.findOne({
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

    if (profile) throw new ErrorException(StatusCode.Bad_Request, `Profile ${name} already exists`);
  };
}
