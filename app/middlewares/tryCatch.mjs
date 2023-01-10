// eslint-disable-next-line consistent-return
const asyncHandler = (endpoint) => async (req, res, next) => {
  try {
    return await endpoint(req, res, next);
  } catch (error) {
    next(error);
  }
};

// const asyncHandler = (endpoint) => async (req, res, next) => Promise.resolve(endpoint(req, res, next)).catch(next);

export default asyncHandler;
