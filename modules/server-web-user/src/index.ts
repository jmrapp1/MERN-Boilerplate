import UserDataModel, { UserDocument, userSchema as UserSchema } from './models/User';
import UserController from './controllers/UserController';
import UserService from './services/UserService';
import { Container } from 'typedi';
import { Events, EVENT_INITIALIZED } from '@jrapp/server-core-events';
import { Logger } from '@jrapp/server-core-logging';
import { registerModuleContext } from '@jrapp/server-core-module/dist';
import UserModuleContext from './context/UserModuleContext';

export const MODULE_NAME = 'Web-User';
export const ModuleContext = new UserModuleContext(MODULE_NAME, '#ff1744');
export const ModuleLogger: Logger = ModuleContext.logger;
registerModuleContext(ModuleContext);

Container.get(Events).once(EVENT_INITIALIZED, () => {
    ModuleLogger.info('Initialized.');
});

export * from './passport';
export {
    UserDataModel,
    UserDocument,
    UserSchema,
    UserController,
    UserService
}