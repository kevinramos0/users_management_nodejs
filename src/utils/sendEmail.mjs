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
      subject: 'Confirma tu cuenta',
      html: `<div
      style="background-color: #f5f3f2; border-radius: 5px; text-align: center">
      <br />
      <img src = "./img/logo.svg" alt="logo" width="350px"/>
      <h2>Necesitas Verificar tu cuenta</h2>
        <p
          style="
            background-color: #a64a4a;
            color: white;
            font-size: 18px;
            width: 250px;
            text-align: center;
            display: inline-block;
            border-radius: 5px">
          Hola ${email}
        </p>
        <p>
        Para confirmar tu cuenta debes hacer click en el siguiente enlace
      </p>
      <a href="${url}">
        <button
        style="
        background-color: #a64a4a;
        color: white;
        font-size: 18px;
        width: 250px;
        height: 40px;
        border-radius: 8px">
          Confirmar cuenta
        </button>
      </a>
      <br />
        <p>
          Este correo tiene una validez de 15 minutos
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
      subject: 'Cambiar contraseña',
      html: ` <div
      style="background-color: #f5f3f2; border-radius: 5px; text-align: center">
      <br />
      <img src = "./img/logo.svg" alt="logo" width="350px"/>
      <h2>Solicitud de cambio de contraseña</h2>
        <p
          style="
            background-color: #a64a4a;
            color: white;
            font-size: 18px;
            width: 250px;
            text-align: center;
            display: inline-block;
            border-radius: 5px">
          ${email}
        </p>
        <p>
        Para cambiar tu contraseña debes hacer click en el siguiente enlace
      </p>
      <a href="${url}">
        <button
          style="
            background-color: #a64a4a;
            color: white;
            font-size: 18px;
            width: 250px;
            height: 40px;
            border-radius: 8px">
          Cambiar Contraseña
        </button>
      </a>
      <br />
        <p>
          ¿No has solicitado este cambio? <br />
          Omite este correo y tu contraseña seguirá siendo la misma.
        </p>
        <p>
          Este correo tiene una validez de 15 minutos
        </p>
        <br />
    </div>`,
    });
  } catch (error) {
    throw new ErrorException(StatusCode.InternalServerError, error);
  }
};

export { sendEmailVerifyUser, sendEmailResetPassword };
