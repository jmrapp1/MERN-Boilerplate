import Test, { TestDocument } from './models/Test';
import TestController from './controllers/TestController';
import TestService from './services/TestService';
import { Container } from 'typedi';
import { Events, EVENT_INITIALIZED } from '@modulfy/core-events';
import { Module, ModuleContext } from '@modulfy/core-module/dist';

export const ExampleWebModule = new Module('Web-Example', '#8e24aa', new ModuleContext());

Container.get(Events).once(EVENT_INITIALIZED, () => {
    ExampleWebModule.logger.info('Initialized.');
});

export {
    Test,
    TestDocument,
    TestController,
    TestService
}