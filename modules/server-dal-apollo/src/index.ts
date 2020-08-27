import { Container } from 'typedi';
import { Events, EVENT_INITIALIZED } from '@modulfy/server-core-events';
import GraphQLService from './services/GraphQLService';
import { Module, ModuleContext } from '@modulfy/server-core-module/dist';

export const ApolloModule = new Module('DAL-Apollo', '#14AA52', new ModuleContext());

Container.get(GraphQLService); // Construct
Container.get(Events).once(EVENT_INITIALIZED, () => {
    ApolloModule.logger.info('Initialized.');
});

export * from './constants/Events';
export {
    GraphQLService
}