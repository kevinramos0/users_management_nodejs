import nodemailer from 'nodemailer';
import './env.mjs';

const transport = nodemailer.createTransport({
  host: `${process.env.HOST_SERVER_EMAIL}`,
  port: +process.env.PORT_SERVER_EMAIL,
  secure: !!process.env.SECURE_SERVER_EMAIL === 'true',
  auth: {
    user: `${process.env.USER_SERVER_EMAIL}`,
    pass: `${process.env.PASS_SERVER_EMAIL}`,
  },
});

export default transport;
