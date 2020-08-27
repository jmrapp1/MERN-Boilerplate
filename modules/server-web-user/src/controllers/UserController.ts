import { JsonController, Post, Res, UseBefore } from 'routing-controllers';
import { AbstractController, BuildResource, HeaderMiddleware, HttpUtils } from '@modulfy/server-core-web';
import { Inject } from 'typedi';
import {
    JwtMapper,
    UserLoginMapper,
    UserLoginResource,
    UserRegisterMapper,
    UserRegisterResource
} from '@modulfy/shared-resources-user';
import UserService from '../services/UserService';
import { UserWebModule } from '../index';
import { UserMapper } from '@modulfy/shared-resources-user/dist';

@UseBefore(HeaderMiddleware)
@JsonController('/user')
export default class UserController extends AbstractController {

    userService: UserService;

    constructor(@Inject(type => UserService) userService: UserService) {
        super(UserWebModule.logger);
        this.userService = userService;
    }

    @Post('/register')
    async register(@Res() response: any, @BuildResource(UserRegisterMapper, true) registerResource: UserRegisterResource) {
        if (!registerResource) return response;
        try {
            await this.userService.validateAllRegisterData(registerResource);
            const res = await this.userService.createUser(registerResource);
            return response.status(200).json(HttpUtils.mappedResourceToJson(res.data, UserMapper));
        } catch (err) {
            return this.handleServiceError(response, err)
        }
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
