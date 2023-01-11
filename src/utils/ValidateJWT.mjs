import jwt from 'jsonwebtoken';

const verifyToken = async (token, key) => {
  try {
    return jwt.verify(token, key);
  } catch (e) {
    return null;
  }
};

const decodeSign = async (token) => {
  try {
    return jwt.decode(token, null);
  } catch (e) {
    return null;
  }
};

export { verifyToken, decodeSign };
