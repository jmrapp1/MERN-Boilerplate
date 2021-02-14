import { Container } from 'typedi';
import { Events, EVENT_INITIALIZED } from '@modulfy/core-events';
import MongoDal from './dal/MongoDal';
import MongoConfig from './config/MongoConfig';
import { Module, ModuleContext } from '@modulfy/core-module/dist';
import { MongoDataModelBuilder } from './dao/MongoDataModelBuilder';
import MongoDataModel from './dao/MongoDataModel';

export const MongoDbModule = new Module('DAL-MongoDB', '#14AA52', new ModuleContext());

Container.get(Events).once(EVENT_INITIALIZED, () => {
    MongoDbModule.logger.info('Initialized.');
});

export * from './constants/Events';
export {
    MongoDataModelBuilder,
    MongoDataModel,
    MongoDal,
    MongoConfig
}