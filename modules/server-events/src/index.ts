import Events from './Events';
import { registerModule } from '../../server-module/dist';
import { Logger } from '@jrapp/server-logging';

export const MODULE_NAME = 'Events';
export const ModuleContext = registerModule(MODULE_NAME, '#ffef62');
export const ModuleLogger: Logger = ModuleContext.logger;

export * from './EventConstants';
export {
    Events
}