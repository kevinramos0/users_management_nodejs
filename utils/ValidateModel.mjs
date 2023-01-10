import ErrorException from '../handlers/ErrorExceptions.mjs';
import StatusCode from '../handlers/StatusCode.mjs';

const validateModel = async (model, id, messageError) => {
  const resultado = await model.findByPk(id);
  if (!resultado) throw new ErrorException(StatusCode.NotFound, messageError);
  return resultado;
};

export default validateModel;
