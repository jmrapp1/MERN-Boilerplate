import { Service } from 'typedi';
import * as EmailValidator from 'email-validator';
import ServiceResponse from './response/ServiceResponse';
import DatabaseService from './DatabaseService';
import { encode } from 'jwt-simple';
import User, { UserDocument } from '../models/User';
import {UserLoginResource} from '../../shared/resources/user/UserLoginResource';
import {JwtResource} from '../../shared/resources/user/JwtResource';
import {UserRegisterResource} from '../../shared/resources/user/UserRegisterResource';

@Service()
export default class UserService extends DatabaseService<UserDocument> {

    model = User;

    /**
     * Logs a user in
     * @param loginResource The login resource
     * @returns {Promise<ServiceResponse>} The JWT token if successful, error if unsuccessful
     */
    async login(loginResource: UserLoginResource): Promise<ServiceResponse<JwtResource>> {
        const userSearch = await this.findWithLimit({username: loginResource.username}, 1)
        if (!userSearch.isEmpty()) {
            const user = userSearch.data[0];
            const passValidated = await (user as any).comparePassword(loginResource.password);
            if (passValidated) {
                const token = encode(user, process.env.PASSPORT_SECRET);
                return new ServiceResponse(new JwtResource({ jwtToken: 'Bearer ' + token }));
            }
            throw new ServiceResponse('The username or password is incorrect.', 400);
        } else {
            throw new ServiceResponse('The username or password is incorrect.', 400);
        }
    }

    async validateRegisterData(registerResource: UserRegisterResource) {
        if (!registerResource.email) throw new ServiceResponse('Please enter an email', 400);
        if (!registerResource.username) throw new ServiceResponse('Please enter a username', 400);
        if (!registerResource.firstName) throw new ServiceResponse('Please enter your first name', 400);
        if (!registerResource.lastName) throw new ServiceResponse('Please enter your last name', 400);
        if (!registerResource.phone) throw new ServiceResponse('Please enter your phone number', 400);
        if (!registerResource.password) throw new ServiceResponse('Please enter a password', 400);
        if (!registerResource.confirmPassword) throw new ServiceResponse('Please enter the password confirmation', 400);

        if (registerResource.username.length < 6) return 'Please enter a username that is at least 6 characters.';
        if (registerResource.password !== registerResource.confirmPassword) return 'Please make sure the passwords match.';
        if (registerResource.password.length < 6) return 'Please enter a password at least 6 characters long.';
        if (!EmailValidator.validate(registerResource.email)) return 'Please enter a valid email.';
        if (registerResource.phone.length !== 10 || !registerResource.phone.match(/^[0-9]+$/)) return 'Please enter a valid phone number.';

        const res = await this.find({email: registerResource.email})
        if (!res.isEmpty()) {
            throw new ServiceResponse('A user already exists with that email', 400);
        }
    }

    async register(registerResource: UserRegisterResource): Promise<ServiceResponse<any>> {
        await this.validateRegisterData(registerResource);
        return this.insert({
            email: registerResource.email,
            password: registerResource.password,
        });
    }
}
