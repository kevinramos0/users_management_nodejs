import transport from '../configs/email.mjs';
import ErrorException from '../configs/handlers/ErrorExceptions.mjs';
import StatusCode from '../configs/handlers/StatusCode.mjs';
import '../configs/env.mjs';

const sendEmailVerifyUser = async (email, token) => {
  const url = `${process.env.BASE_URL}/verify/account/?token=${token}`;
  try {
    transport.sendMail({
      from: `${process.env.EMAIL}`,
      to: `${email}`,
      subject: 'Welcome!',
      html: `<div
      style="text-align: center">
      <br />
      <img src = "./img/logo.svg" alt="logo" width="350px"/>
      <h2 style="color: #448AFF;">Please verify your email</h2>
        <p
          style="
            color:  #448AFF;
            font-size: 18px;
            width: auto;
            display: inline-block;">
          Hi ${email}
        </p>
        <p>
        To confirm your account you must click on the following link
        </p>
      <a href="${url}">
        <button
        style="
        background-color: #448AFF;
        color: white;
        font-size: 18px;
        width: 250px;
        padding: 6px;
        border-radius: 100px;
        border-width: 0;
        box-shadow: none;
        box-sizing: border-box;
        cursor: pointer;
        border-radius: 1rem">
        Verify my account
        </button>
      </a>
      <br />
        <p>
        This email is valid for 15 minutes.
        </p>
        <br />
    </div>`,
    });
  } catch (error) {
    throw new ErrorException(StatusCode.InternalServerError, error);
  }
};

const sendEmailResetPassword = async (email, token) => {
  const url = `${process.env.BASE_URL}/change/password/?token=${token}`;
  try {
    transport.sendMail({
      from: `${process.env.EMAIL}`,
      to: `${email}`,
      subject: 'Password Reset',
      html: `<div
      style="text-align: center">
      <br />
      <img src = "./img/logo.svg" alt="logo" width="350px"/>
      <h2 style="color: #448AFF;">Forgot your password?</h2>
        <p
          style="
          color:  #448AFF;
            font-size: 18px;
            width: auto;
            display: inline-block;">
          ${email}
        </p>
        <p>
        To change your password you must click on the following link
      </p>
      <a href="${url}">
        <button
          style="
          background-color: #448AFF;
          color: white;
          font-size: 18px;
          width: 250px;
          padding: 6px;
          border-radius: 100px;
          border-width: 0;
          box-shadow: none;
          box-sizing: border-box;
          cursor: pointer;
          border-radius: 1rem">
          Reset my password
        </button>
      </a>
      <br />
        <p>
        Haven't you requested this change? <br /> <br />
        Ignore this email and your password will remain the same.
        </p>
        <p>
        This email is valid for 15 minutes.
        </p>
        <br />
    </div>`,
    });
  } catch (error) {
    throw new ErrorException(StatusCode.InternalServerError, error);
  }
};

export { sendEmailVerifyUser, sendEmailResetPassword };
