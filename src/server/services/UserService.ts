import { Service } from 'typedi';
import ServiceResponse from './ServiceResponse';
import UserLoginResource from '../../shared/resources/user/UserLoginResource';
import DatabaseService from './DatabaseService';
import { encode } from 'jwt-simple';
import Config from '../config/config';
import JwtResource from '../../shared/resources/user/JwtResource';
import User from '../models/User';
import UserRegisterResource from '../../shared/resources/user/UserRegisterResource';
import UserRegisterMapper from '../../shared/mappers/user/UserRegisterMapper';
import UserLoginMapper from '../../shared/mappers/user/UserLoginMapper';

@Service()
export default class UserService extends DatabaseService {

    model = User;

    /**
     * Logs a user in
     * @param loginResource The login resource
     * @returns {Promise<ServiceResponse>} The JWT token if successful, error if unsuccessful
     */
    login(loginResource: UserLoginResource): Promise<ServiceResponse> {
        return this.promise(resolve => {
            if (!loginResource.validated) {
                const error = UserLoginMapper.verifyAllConstraints(loginResource);
                if (error) return resolve(new ServiceResponse(error, true));
            }

            this.findWithLimit({ username: loginResource.username }, 1).then(userSearch => {
                if (userSearch.isSuccess() && !userSearch.isEmpty()) {
                    const user = userSearch.data[ 0 ];
                    user.comparePassword(loginResource.password).then(passValidated => {
                        if (passValidated) {
                            const token = encode(user, Config.secret);
                            return resolve(new ServiceResponse(new JwtResource('JWT ' + token)));
                        }
                        return resolve(new ServiceResponse('The username or password is incorrect.', true));
                    });
                } else {
                    return resolve(new ServiceResponse('The username or password is incorrect.', true));
                }
            });
        });
    }

    validateRegisterData(registerResource: UserRegisterResource) {
        return this.promise(resolve => {
            if (!registerResource.validated) {
                const error = UserRegisterMapper.verifyAllConstraints(registerResource);
                if (error) return resolve(new ServiceResponse(error, true));
            }

            this.find({
                $or: [
                    { email: registerResource.email },
                    { username: registerResource.username }
                ]
            }).then(res => {
                if (res.isSuccess() && res.isEmpty()) {
                    return resolve(new ServiceResponse());
                } else {
                    if (res.data[0].username === registerResource.username) return resolve(new ServiceResponse('That username has already been used.', true));
                    return resolve(new ServiceResponse('That email has already been used.', true));
                }
            });
        });
    }

    register(registerResource: UserRegisterResource): Promise<ServiceResponse> {
        return new Promise<ServiceResponse>(resolve => {
            this.validateRegisterData(registerResource).then(valRes => {
                if (valRes.isSuccess()) {
                    this.insert({
                        username: registerResource.username,
                        email: registerResource.email,
                        firstName: registerResource.firstName,
                        lastName: registerResource.lastName,
                        phone: registerResource.phone,
                        password: registerResource.password,
                    }).then(insertRes => {
                        return resolve(insertRes);
                    });
                } else {
                    return resolve(valRes);
                }
            })
        });
    }


}
