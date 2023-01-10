import Profile from './ProfileModel.mjs';
import User from './UserModel.mjs';
import Rol from './RolModel.mjs';
import ProfileRol from './ProfileRolModel.mjs';
import RefreshToken from './RefreshTokenModel.mjs';

Profile.relationship();
User.relationship();
Rol.relationship();
RefreshToken.relationship();

export {
  Profile,
  User,
  Rol,
  ProfileRol,
  RefreshToken,
};
