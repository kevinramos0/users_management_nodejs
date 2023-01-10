import { Router } from 'express';
import Auth from './auth.mjs';
import User from './users.mjs';

const router = Router();

router.use('/auth', Auth);
router.use('/users', User);

router.get('*', (req, res, next) => {
  // res.status(404);
  // res.send({ error: 'Recurso No Encontrado' });
  setImmediate(() => next(new Error('Recurso No Encontrado')));
});

export default router;
