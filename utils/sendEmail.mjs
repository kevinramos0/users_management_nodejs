import transport from '../configs/email.mjs';
import ErrorException from '../handlers/ErrorExceptions.mjs';
import StatusCode from '../handlers/StatusCode.mjs';
import '../configs/env.mjs';

const sendEmailConfirmUser = async (name, email, token) => {
  try {
    transport.sendMail({
      from: `${process.env.EMAIL}`,
      to: `${email}`,
      subject: 'Confirma tu cuenta',
      html: ` <div
      style="background-color: #ffcc99; border-radius: 5px; text-align: center">
      <br />
      <h2>Bienvenido ${name}</h2>
      <p>
        Hola ${name}, necesitas verificar tu cuenta. <br />
        por favor has clic en el botón confirmar cuenta para continuar.
      </p>
      <a href="${process.env.BASE_URL}/api/users/verify/account/${token}">
        <button
          style="
            background-color: black;
            color: white;
            font-size: 20px;
            width: 250px;
            height: 40px;
            border-radius: 5px">
          Confirmar cuenta
        </button>
      </a>
      <br />
      <br />
      <div
        style="
          background-color: black;
          color: white;
          height: 70px;
          border-end-start-radius: 5px;
          border-end-end-radius: 5px;">
        <br />
        <p>Este correo tiene una validez de 24 horas</p>
      </div>
    </div>`,
    });
  } catch (error) {
    throw new ErrorException(StatusCode.InternalServerError, 'Error al enviar el correo de confirmación');
  }
};

const sendEmailResetPassword = async (email, token) => {
  try {
    transport.sendMail({
      from: `${process.env.EMAIL}`,
      to: `${email}`,
      subject: 'Cambiar contraseña',
      html: ` <div
      style="background-color: #ffcc99; border-radius: 5px; text-align: center">
      <br />
      <h2>Solicitud de cambio de contraseña</h2>
      <p>
        ¿Has solicitado cambiar tu contraseña para ${email}? <br />
        por favor has clic en el botón cambiar contraseña para crear una nueva.
      </p>
      <a href="${process.env.BASE_URL}/api/users/reset/password/${token}">
        <button
          style="
            background-color: black;
            color: white;
            font-size: 20px;
            width: 250px;
            height: 40px;
            border-radius: 5px">
          Cambiar contraseña
        </button>
      </a>
      <br />
      <br />
      <div
        style="
          background-color: black;
          color: white;
          height: 70px;
          border-end-start-radius: 5px;
          border-end-end-radius: 5px;">
        <p>
          Este correo tiene una validez de 24 horas</p> <br />
          Si no has solicitado un cambio de contraseña Omite este correo y tu contraseña seguirá siendo la misma.
        </p>
      </div>
    </div>`,
    });
  } catch (error) {
    throw new ErrorException(StatusCode.InternalServerError, 'Error al enviar el correo intente más tarde');
  }
};

export { sendEmailConfirmUser, sendEmailResetPassword };
