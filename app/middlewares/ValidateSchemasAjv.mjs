import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import AjvErrors from 'ajv-errors';
import { dates } from 'ajv-dates';
import StatusCode from '../../handlers/StatusCode.mjs';

const ajv = dates(new Ajv({
  allErrors: true,
  $data: true,
}));

addFormats(ajv);
AjvErrors(ajv);

const ValidateSchema = (schema) => {
  const validate = ajv.compile(schema);
  // eslint-disable-next-line consistent-return
  return (req, res, next) => {
    try {
      if (validate(req.body)) {
        return next();
      }
      return res.status(StatusCode.Bad_Request).json({
        message: validate.errors[0].message,
      });
    } catch (error) {
      next(error);
    }
  };
};

export default ValidateSchema;
