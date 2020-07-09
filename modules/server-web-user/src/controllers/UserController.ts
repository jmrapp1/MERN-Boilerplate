import { BodyParam, Get, JsonController, Post, Req, Res, UseBefore } from 'routing-controllers';
import { AbstractController, BuildResource, HeaderMiddleware, HttpUtils } from '@jrapp/server-core-web';
import { Container } from 'typedi';
import {
    JwtMapper,
    UserLoginMapper,
    UserLoginResource,
    UserRegisterMapper,
    UserRegisterResource
} from '@jrapp/shared-resources-user';

import { ModuleLogger } from '../index';
import UserService from '../services/UserService';

@UseBefore(HeaderMiddleware)
@JsonController('/user')
export default class UserController extends AbstractController {

    userService: UserService;

    constructor() {
        super(ModuleLogger);
        this.userService = Container.get(UserService);
    }

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
