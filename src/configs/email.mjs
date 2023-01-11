import nodemailer from 'nodemailer';
import './env.mjs';

const transport = nodemailer.createTransport({
  host: `${process.env.HOST_SERVER_EMAIL}`,
  port: `${process.env.PORT_SERVER_EMAIL}`,
  auth: {
    user: `${process.env.USER_SERVER_EMAIL}`,
    pass: `${process.env.PASS_SERVER_EMAIL}`,
  },
});

export default transport;
