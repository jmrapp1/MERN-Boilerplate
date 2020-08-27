import { ResourceMappingManager } from '@modulfy/shared-core-resources';
import JwtMapper from './mappers/JwtMapper';
import UserLoginMapper from './mappers/UserLoginMapper';
import UserRegisterMapper from './mappers/UserRegisterMapper';
import JwtResource from './resources/JwtResource';
import UserLoginResource from './resources/UserLoginResource';
import UserRegisterResource from './resources/UserRegisterResource';
import UserResource from './resources/UserResource';
import PrivateUserResource from './resources/PrivateUserResource';
import PrivateUserMapper from './mappers/PrivateUserMapper';
import UserMapper from './mappers/UserMapper';

ResourceMappingManager.addMapper(
    JwtMapper,
    UserLoginMapper,
    UserRegisterMapper,
    UserMapper,
    PrivateUserMapper
);

export {
    JwtMapper,
    UserLoginMapper,
    UserRegisterMapper,
    UserMapper,
    PrivateUserMapper,
    UserResource,
    PrivateUserResource,
    JwtResource,
    UserLoginResource,
    UserRegisterResource
}