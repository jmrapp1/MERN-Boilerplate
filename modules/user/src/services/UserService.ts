import { Inject, Service } from 'typedi';
import { encode } from 'jwt-simple';
import UserDataModel, { UserDocument } from '../models/User';
import { ServiceResponse } from '@modulfy/core-web';
import { MongoDal } from '@modulfy/dal-mongodb';
import {
    JwtResource,
    UserLoginMapper,
    UserRegisterMapper,
    UserRegisterResource,
    UserLoginResource
} from '@modulfy/user';
import { UserWebModule } from '../index';
import UserModuleContext from '../module/UserModuleContext';

@Service()
export default class UserService extends MongoDal<UserDocument> {

    protected moduleContext: UserModuleContext = UserWebModule.context;

    constructor() {
        super(UserDataModel, UserWebModule.logger);
    }

    /**
     * Logs a user in
     * @param loginResource The login resource
     * @returns {Promise<ServiceResponse>} The JWT token if successful, error if unsuccessful
     */
    async login(loginResource: UserLoginResource): Promise<ServiceResponse<JwtResource>> {
        this.validateUserLoginConstraints(loginResource);
        let userSearch = await this.find({ username: loginResource.username }, 1);
        if (userSearch.isEmpty()) {
            userSearch = await this.find({ email: loginResource.username}, 1);
        }
        if (!userSearch.isEmpty()) {
            const user = userSearch.data[0];
            const passValidated = await (user as any).comparePassword(loginResource.password);
            if (passValidated) {
                const token = encode(user, this.moduleContext.moduleOptions.jwtSecret);
                return new ServiceResponse(new JwtResource().init('JWT ' + token));
            }
            throw new ServiceResponse('The username/email and password combination is incorrect.', 400);
        }
        throw new ServiceResponse('The username/email and password combination is incorrect.', 400);
    }

    validateUserLoginConstraints(loginResource: UserLoginResource) {
        if (!loginResource.validated) {
            const error = UserLoginMapper.verifyAllConstraints(loginResource);
            if (error) throw new ServiceResponse(error);
        }
    }

    async validateAllRegisterData(registerResource: UserRegisterResource): Promise<any> {
        this.validateRegisterResourceConstraints(registerResource);
        await this.validateEmailUnique(registerResource.email);
        await this.validateUsernameUnique(registerResource.username);
    }

    validateRegisterResourceConstraints(registerResource: UserRegisterResource) {
        if (!registerResource.validated) {
            const error = UserRegisterMapper.verifyAllConstraints(registerResource);
            if (error) throw new ServiceResponse(error);
        }
    }

    async validateUsernameUnique(username: string) {
        const res = await this.find({ username }, 1);
        if (!res.isEmpty()) {
            throw new ServiceResponse('That username has already been used.', 400);
        }
    }

    async validateEmailUnique(email: string) {
        const res = await this.find({ email }, 1);
        if (!res.isEmpty()) {
            throw new ServiceResponse('That email has already been used.', 400);
        }
    }

    async createUser(registerResource: UserRegisterResource): Promise<ServiceResponse<UserDocument>> {
        return this.insert({
            username: registerResource.username,
            email: registerResource.email,
            firstName: registerResource.firstName,
            lastName: registerResource.lastName,
            phone: registerResource.phone,
            password: registerResource.password
        });

    }
}
