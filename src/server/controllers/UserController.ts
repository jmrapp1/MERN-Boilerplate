import { BodyParam, Get, JsonController, Post, Req, Res, UseBefore } from 'routing-controllers';
import { encode } from 'jwt-simple';
import { BuildResource } from '../modules/resource-mapping/decorators/BuildResource';
import UserRegisterMapper from '../../shared/mappers/user/UserRegisterMapper';
import UserRegisterResource from '../../shared/resources/user/UserRegisterResource';
import HttpUtils from '../util/HttpUtils';
import UserLoginMapper from '../../shared/mappers/user/UserLoginMapper';
import UserLoginResource from '../../shared/resources/user/UserLoginResource';
import { Inject } from 'typedi';
import UserService from '../services/UserService';
import JwtMapper from '../../shared/mappers/user/JwtMapper';

@JsonController('/user')
export default class UserController {

    @Inject()
    userService: UserService;

    @Post('/register')
    register(@Res() response: any, @BuildResource(UserRegisterMapper, true) registerResource: UserRegisterResource) {
        if (!registerResource) return response;
        return this.userService.register(registerResource).then(res => {
            if (res.isSuccess()) return response.status(200).json({});
            return response.status(400).json(res.buildBadRequestError().getJson());
        });
    }

    @Post('/login')
    login(@Res() response: any, @BuildResource(UserLoginMapper, true) loginResource: UserLoginResource) {
        if (!loginResource) return response;
        return this.userService.login(loginResource).then(res => {
            if (res.isSuccess()) return response.status(200).json(HttpUtils.mappedResourceToJson(res.data, JwtMapper.id));
            return response.status(400).json(res.buildBadRequestError().getJson());
        });
    }

}
