import { Router } from 'express';
import Auth from './auth.mjs';
import User from './users.mjs';
import Profiles from './profiles.mjs';
import Rols from './rols.mjs';
import Modules from './modules.mjs';

const router = Router();

router.use('/auth', Auth);
router.use('/profiles', Profiles);
router.use('/users', User);
router.use('/rols', Rols);
router.use('/modules', Modules);

router.get('*', (req, res, next) => {
  // res.status(404);
  // res.send({ error: 'Recurso No Encontrado' });
  setImmediate(() => next(new Error('Recurso No Encontrado')));
});

export default router;
