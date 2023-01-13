const moment = require('moment-timezone');
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface) => {
    const TRANSACTION = await queryInterface.sequelize.transaction();
    try {
      const passwordEncrypted = await bcrypt.hash('admin', 10);
      const [Rol] = await queryInterface.bulkInsert(
        'rols',
        [
          {
            name: 'Admin',
            is_active: true,
            created_at: moment().tz('America/El_Salvador').format(),
          },
        ],
        {
          returning: ['id'],
          transaction: TRANSACTION,
        },
      );
      const Modules = await queryInterface.bulkInsert(
        'modules',
        [
          {
            name: 'Users',
            name_ruta: 'users',
            description: 'module for management users',
            icon: 'mdi-account-group',
            is_public: false,
            is_active: true,
            created_at: moment().tz('America/El_Salvador').format(),
          },
          {
            name: 'Profiles',
            name_ruta: 'profiles',
            description: 'modules for management profiles',
            icon: 'mdi-account-tie',
            is_public: false,
            is_active: true,
            created_at: moment().tz('America/El_Salvador').format(),
          },
          {
            name: 'Rols',
            name_ruta: 'rols',
            description: 'module for management rols',
            icon: 'mdi-account-cog',
            is_public: false,
            is_active: true,
            created_at: moment().tz('America/El_Salvador').format(),
          },
        ],
        {
          returning: ['id'],
          transaction: TRANSACTION,
        },
      );

      const [Profile] = await queryInterface.bulkInsert(
        'profiles',
        [
          {
            name: 'Administrator',
            description: 'administrator to system',
            is_active: true,
            created_at: moment().tz('America/El_Salvador').format(),
          },
        ],
        {
          returning: ['id'],
          transaction: TRANSACTION,
        },
      );
      // eslint-disable-next-line no-unused-vars
      await queryInterface.bulkInsert(
        'users',
        [
          {
            email: 'administrator@email.com',
            password: passwordEncrypted,
            is_active: true,
            is_verified: true,
            id_profile: Profile.id,
            created_at: moment().tz('America/El_Salvador').format(),
          },
        ],
        {
          returning: ['id'],
          transaction: TRANSACTION,
        },
      );

      /** ASIGNAR ROL DE ADMIN AL USUARIO ADMINISTRATOR */
      await queryInterface.bulkInsert(
        'profiles_rols',
        [{ id_profile: Profile.id, id_rol: Rol.id }],
        {
          returning: ['id_profile', 'id_rol'],
          transaction: TRANSACTION,
        },
      );

      /** ASIGNAR MODULOS AL USUARIO ADMINISTRATOR */
      await queryInterface.bulkInsert(
        'profiles_modules',
        Modules.map((module) => ({
          id_profile: Profile.id,
          id_module: module.id,
        })),
        {
          returning: ['id_profile', 'id_module'],
          transaction: TRANSACTION,
        },
      );
      await TRANSACTION.commit();
    } catch (e) {
      await TRANSACTION.rollback();
    }
  },

  down: async (queryInterface) => {
    await Promise.all([
      queryInterface.bulkDelete('rols', null, {}),
      queryInterface.bulkDelete('modules', null, {}),
      queryInterface.bulkDelete('profiles', null, {}),
      queryInterface.bulkDelete('users', null, {}),
      queryInterface.bulkDelete('profiles_rols', null, {}),
      queryInterface.bulkDelete('profiles_modules', null, {}),
    ]);
  },
};
