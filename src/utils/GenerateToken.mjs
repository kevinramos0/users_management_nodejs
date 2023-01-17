import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import moment from 'moment-timezone';
import { RefreshToken } from '../models/index.mjs';
import '../configs/env.mjs';

export default class Auth {
  static async createToken(id) {
    return new Promise((resolve, reject) => {
      jwt.sign(
        { id },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.TIME_TOKEN,
        },
        (err, token) => {
          if (err) reject(err);
          else resolve(token);
        }
      );
    });
  }

  static async refresh_token(id) {
    const refreshToken = uuid();
    const result = await RefreshToken.create({
      refresh_token: refreshToken,
      id_user: id,
      date_valid: moment()
        .add(process.env.TIME_TOKEN_REFRESH, process.env.TYPE_TIME_TOKEN_REFRES)
        .tz('America/El_Salvador')
        .format(),
    });
    return result.refresh_token;
  }

  static async createEmailToken(id) {
    return new Promise((resolve, reject) => {
      jwt.sign(
        { id },
        process.env.EMAIL_TOKEN,
        {
          expiresIn: process.env.TIME_TOKEN_EMAIL,
        },
        (err, tokenEmail) => {
          if (err) reject(err);
          else resolve(tokenEmail);
        }
      );
    });
  }
}
