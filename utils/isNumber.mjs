import ErrorException from '../handlers/ErrorExceptions.mjs';
import StatusCode from '../handlers/StatusCode.mjs';

const isNumber = async (number, message = 'No es un numero') => {
  const validateNumber = (/^[0-9]*$/);
  const valido = validateNumber.test(number);
  if (!valido) throw new ErrorException(StatusCode.Bad_Request, message);
  return valido;
};

export default isNumber;
