import { BodyParam, Get, JsonController, Post, Req, Res, UseBefore } from 'routing-controllers';
import { Inject } from 'typedi';
import UserService from '../services/UserService';
import BaseController from './BaseController';
import {BuildResource} from '../decorators/build_resource';
import {UserRegisterResource} from '../../shared/resources/user/UserRegisterResource';
import {UserLoginResource} from '../../shared/resources/user/UserLoginResource';

@JsonController('/user')
export default class UserController extends BaseController {

    @Inject()
    userService: UserService;

    @Post('/register')
    register(@Res() response: any, @BuildResource(UserRegisterResource) registerResource: UserRegisterResource) {
        if (!registerResource) return response;
        return this.userService.register(registerResource).then(
            res => response.status(200).json({}),
            err => this.handleServiceError(response, err)
        );
    }

    @Post('/login')
    login(@Res() response: any, @BuildResource(UserLoginResource) loginResource: UserLoginResource) {
        if (!loginResource) return response;
        return this.userService.login(loginResource).then(
            res => response.status(200).json(res.data),
            err => this.handleServiceError(response, err)
        );
    }

}
