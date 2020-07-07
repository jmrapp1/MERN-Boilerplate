import Test, { TestDocument } from './models/Test';
import TestController from './controllers/TestController';
import TestService from './services/TestService';
import { Container } from 'typedi';
import { Events, INITIALIZED } from '@jrapp/server-events';
import { Logger } from '@jrapp/server-logging';

Container.get(Events).once(INITIALIZED, () => {
    Logger.info('[Server-Example-Module] Module Initialized.');
});

export {
    Test,
    TestDocument,
    TestController,
    TestService
}