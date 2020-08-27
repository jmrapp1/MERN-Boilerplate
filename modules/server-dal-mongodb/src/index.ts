import { Container } from 'typedi';
import { Events, EVENT_INITIALIZED } from '@modulfy/server-core-events';
import MongoDal from './dal/MongoDal';
import MongoConfig from './config/MongoConfig';
import MongoDataModel from './dal/MongoDataModel';
import { Module, ModuleContext } from '@modulfy/server-core-module/dist';

export const MongoDbModule = new Module('DAL-MongoDB', '#14AA52', new ModuleContext());

Container.get(Events).once(EVENT_INITIALIZED, () => {
    MongoDbModule.logger.info('Initialized.');
});

export * from './constants/Events';
export {
    MongoDal,
    MongoConfig,
    MongoDataModel
}