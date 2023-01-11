import bcrypt from 'bcryptjs';
import ErrorException from '../configs/handlers/ErrorExceptions.mjs';
import StatusCode from '../configs/handlers/StatusCode.mjs';

const encriptar = async (textPlain) => {
  const hash = await bcrypt.hash(textPlain, 10);
  return hash;
};

const comparar = async (passwordPlain, hashPassword, message = 'Credential not valid') => {
  const compare = await bcrypt.compare(passwordPlain, hashPassword);
  if (!compare) throw new ErrorException(StatusCode.Bad_Request, message);
  return compare;
};

export { encriptar, comparar };
