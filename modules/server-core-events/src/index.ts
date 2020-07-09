import Events from './Events';
import { registerModule } from '@jrapp/server-core-module';

export const MODULE_NAME = 'Events';
export const ModuleContext = registerModule(MODULE_NAME, '#ffef62');

export * from './EventConstants';
export {
    Events
}