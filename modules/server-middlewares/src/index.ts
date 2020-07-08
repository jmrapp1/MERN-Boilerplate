import { registerModule } from '@jrapp/server-module/dist';
import { Logger } from '@jrapp/server-logging';

export * from './decorators';
export * from './middlewares';

export const MODULE_NAME = 'Middlewares';
export const ModuleContext = registerModule(MODULE_NAME, '#f4511e');
export const ModuleLogger: Logger = ModuleContext.logger;