import { Container } from 'typedi';
import { Events, INITIALIZED } from '@jrapp/server-events';
import { Logger } from '@jrapp/server-logging';
import MongoDal from './dal/MongoDal';
import MongoConfig from './config/MongoConfig';
import MongoDataModel from './dal/MongoDataModel';
import { registerModule } from '@jrapp/server-module';

export const MODULE_NAME = 'DAL-Mongodb';
export const ModuleContext = registerModule(MODULE_NAME, '#14AA52');
export const ModuleLogger: Logger = ModuleContext.logger;

Container.get(Events).once(INITIALIZED, () => {
    ModuleLogger.info('Initialized.');
});

export * from './events/Constants';
export {
    MongoDal,
    MongoConfig,
    MongoDataModel
}