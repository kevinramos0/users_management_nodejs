import Profile from './ProfileModel.mjs';
import User from './UserModel.mjs';
import Rol from './RolModel.mjs';
import Modules from './ModuleModel.mjs';
import ProfileRol from './ProfileRolModel.mjs';
import ProfileModules from './ProfileModulesModel.mjs';
import RefreshToken from './RefreshTokenModel.mjs';

Profile.relationship();
User.relationship();
Rol.relationship();
Modules.relationship();
RefreshToken.relationship();

export {
  Profile, User, Rol, ProfileRol, RefreshToken, Modules, ProfileModules,
};
