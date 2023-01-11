import StatusCode from './StatusCode.mjs';

export default class ErrorException extends Error {
  constructor(code = StatusCode.UnknownError, message = 'Internal Server Error') {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.status = code;
    this.message = message;
  }
}
