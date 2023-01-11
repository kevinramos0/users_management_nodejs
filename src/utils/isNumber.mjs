import ErrorException from '../configs/handlers/ErrorExceptions.mjs';
import StatusCode from '../configs/handlers/StatusCode.mjs';

const isNumber = async (number, message = 'not is number') => {
  const validateNumber = (/^[0-9]*$/);
  const valido = validateNumber.test(number);
  if (!valido) throw new ErrorException(StatusCode.Bad_Request, message);
  return valido;
};

export default isNumber;
