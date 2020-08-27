import UserDataModel, { UserDocument, userSchema as UserSchema } from './models/User';
import UserController from './controllers/UserController';
import UserService from './services/UserService';
import { Container } from 'typedi';
import { Events, EVENT_INITIALIZED } from '@jrapp/server-core-events';
import UserModule from './module/UserModule';

export const UserWebModule = new UserModule('Web-User', '#ff1744');

Container.get(Events).once(EVENT_INITIALIZED, () => {
    UserWebModule.logger.info('Initialized.');
});

export * from './passport';
export {
    UserDataModel,
    UserDocument,
    UserSchema,
    UserController,
    UserService
}