import ErrorException from './ErrorExceptions.mjs';

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  if (err instanceof ErrorException) {
    res.status(err.status).json({ message: err.message });
  } else {
    // For unhandled errors.
    res.status(500).json({ message: err.message });
  }
};

export default errorHandler;
