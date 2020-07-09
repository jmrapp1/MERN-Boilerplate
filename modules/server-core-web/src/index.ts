import AbstractController from './controllers/AbstractController';
import { registerModule } from '@jrapp/server-core-module';
import { Logger } from '@jrapp/server-core-logging';

export const MODULE_NAME = 'Web'; // TODO: Change name of this package
export const ModuleContext = registerModule(MODULE_NAME, '#c0ca33');
export const ModuleLogger: Logger = ModuleContext.logger;

export * from './decorators';
export * from './middlewares';
export * from './responses';
export {
    AbstractController
}