import bcrypt from 'bcryptjs';

const encriptar = async (textPlain) => {
  const hash = await bcrypt.hash(textPlain, 10);
  return hash;
};

const comparar = async (passwordPlain, hashPassword) => {
  const compare = await bcrypt.compare(passwordPlain, hashPassword);
  return compare;
};

export { encriptar, comparar };
