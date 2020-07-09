import { BodyParam, Get, JsonController, Post, Req, Res, UseBefore } from 'routing-controllers';
import { encode } from 'jwt-simple';
import { AbstractController, BuildResource } from '@jrapp/server-core-web';
import { Inject } from 'typedi';

import UserRegisterMapper from '../../shared/mappers/user/UserRegisterMapper';
import UserRegisterResource from '../../shared/resources/user/UserRegisterResource';
import HttpUtils from '../util/HttpUtils';
import UserLoginMapper from '../../shared/mappers/user/UserLoginMapper';
import UserLoginResource from '../../shared/resources/user/UserLoginResource';
import UserService from '../services/UserService';
import JwtMapper from '../../shared/mappers/user/JwtMapper';

@JsonController('/user')
export default class UserController extends AbstractController {

    @Inject()
    userService: UserService;

    @Post('/register')
    register(@Res() response: any, @BuildResource(UserRegisterMapper, true) registerResource: UserRegisterResource) {
        if (!registerResource) return response;
        return this.userService.register(registerResource).then(
            res => response.status(200).json({}),
            err => this.handleServiceError(response, err)
        );
    }

    @Post('/login')
    login(@Res() response: any, @BuildResource(UserLoginMapper, true) loginResource: UserLoginResource) {
        if (!loginResource) return response;
        return this.userService.login(loginResource).then(
            res => response.status(200).json(HttpUtils.mappedResourceToJson(res.data, JwtMapper)),
            err => this.handleServiceError(response, err)
        );
    }

}
