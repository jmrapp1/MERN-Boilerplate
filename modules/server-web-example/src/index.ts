import Test, { TestDocument } from './models/Test';
import TestController from './controllers/TestController';
import TestService from './services/TestService';
import { Container } from 'typedi';
import { Events, EVENT_INITIALIZED } from '@jrapp/server-core-events';
import { Logger } from '@jrapp/server-core-logging';
import { registerModule } from '@jrapp/server-core-module/dist';

export const MODULE_NAME = 'Web-Example';
export const ModuleContext = registerModule(MODULE_NAME, '#8e24aa');
export const ModuleLogger: Logger = ModuleContext.logger;

Container.get(Events).once(EVENT_INITIALIZED, () => {
    ModuleLogger.info('Initialized.');
});

export {
    Test,
    TestDocument,
    TestController,
    TestService
}