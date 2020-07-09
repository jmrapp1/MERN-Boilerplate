import { ResourceMappingManager } from '@jrapp/shared-core-resources';
import JwtMapper from './mappers/JwtMapper';
import UserLoginMapper from './mappers/UserLoginMapper';
import UserRegisterMapper from './mappers/UserRegisterMapper';
import JwtResource from './resources/JwtResource';
import UserLoginResource from './resources/UserLoginResource';
import UserRegisterResource from './resources/UserRegisterResource';

ResourceMappingManager.addMapper(JwtMapper, UserLoginMapper, UserRegisterMapper);

export {
    JwtMapper,
    UserLoginMapper,
    UserRegisterMapper,
    JwtResource,
    UserLoginResource,
    UserRegisterResource
}