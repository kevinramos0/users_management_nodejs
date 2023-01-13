import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const router = new Router();
// eslint-disable-next-line no-underscore-dangle
const __dirname = dirname(fileURLToPath(import.meta.url));

const swaggerDocumento = yaml.load('./src/docs/index.yaml');
// const specs = swaggerJsDoc(options);

// eslint-disable-next-line no-underscore-dangle
// const __filename = path.resolve('../app/docs/index.json');

// Ruta del archivo json de la documentacion
router.use('/documentation/docs.json', (req, res) => {
  res.header('Content-Type', 'application/json');
  res.sendFile(path.join(__dirname, '../docs/index.json'));
});

router.use('/documentation', swaggerUi.serve, swaggerUi.setup(swaggerDocumento));
export default router;
