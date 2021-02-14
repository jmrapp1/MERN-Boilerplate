import UserDataModel, { UserDocument } from './models/User';
import UserController from './controllers/UserController';
import UserService from './services/UserService';
import { Container } from 'typedi';
import { Events, EVENT_INITIALIZED } from '@modulfy/core-events';
import UserModule from './module/UserModule';

export const UserWebModule = new UserModule('Web-User', '#ff1744');

Container.get(Events).once(EVENT_INITIALIZED, () => {
    UserWebModule.logger.info('Initialized.');
});

export * from './passport';
export {
    UserDataModel,
    UserDocument,
    UserController,
    UserService
}