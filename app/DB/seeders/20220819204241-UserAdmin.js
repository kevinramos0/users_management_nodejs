const moment = require('moment-timezone');
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface) => {
    const TRANSACTION = await queryInterface.sequelize.transaction();
    try {
      const passwordEncrypted = await bcrypt.hash('admin', 10);
      const [Profile] = await queryInterface.bulkInsert(
        'profiles',
        [
          {
            firstName: 'Administrador',
            lastName: 'Administrador',
            phone: '0000-0000',
            isActive: true,
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
            id_profile: Profile.id,
            email: 'administrador@email.com',
            password: passwordEncrypted,
          },
        ],
        {
          returning: ['id'],
          transaction: TRANSACTION,
        },
      );
      const [Rol] = await queryInterface.bulkInsert(
        'rols',
        [
          { name: 'SuperAdmin', description: '', isActive: true },
          { name: 'Administrador', description: '', isActive: true },
          { name: 'Usuario', description: '', isActive: true },
        ],
        {
          returning: ['id'],
          transaction: TRANSACTION,
        },
      );

      /** ASIGNAR ROL DE SUPERADMIN AL USUARIO ADMINISTRADOR */
      await queryInterface.bulkInsert(
        'profiles_rols',
        [
          { id_profile: Profile.id, id_rol: Rol.id },
        ],
        {
          returning: ['id_profile', 'id_rol'],
          transaction: TRANSACTION,
        },
      );
      await TRANSACTION.commit();
    } catch (e) {
      await TRANSACTION.rollback();
      console.log(e);
    }
  },

  down: async (queryInterface) => {
    await Promise.all([
      queryInterface.bulkDelete('profiles', null, {}),
      queryInterface.bulkDelete('users', null, {}),
      queryInterface.bulkDelete('rols', null, {}),
      queryInterface.bulkDelete('profiles_rols', null, {}),
    ]);
  },
};
