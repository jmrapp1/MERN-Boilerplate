import { Container } from 'typedi';
import { Events, EVENT_INITIALIZED } from '@jrapp/server-core-events';
import { Logger } from '@jrapp/server-core-logging';
import { registerModule } from '@jrapp/server-core-module';
import GraphQLService from './services/GraphQLService';

export const MODULE_NAME = 'DAL-Apollo';
export const ModuleContext = registerModule(MODULE_NAME, '#14AA52');
export const ModuleLogger: Logger = ModuleContext.logger;

Container.get(GraphQLService); // Construct
Container.get(Events).once(EVENT_INITIALIZED, () => {
    ModuleLogger.info('Initialized.');
});

export * from './events/Constants';
export {
    GraphQLService
}