import MongoDal from './dal/MongoDal';
import MongoConfig from './config/MongoConfig';
import { Container } from 'typedi';
import { Events, INITIALIZED } from '@jrapp/server-events';
import { Logger } from '@jrapp/server-logging';

Container.get(Events).once(INITIALIZED, () => {
    Logger.info('[Server-DAL-Mongodb] Module Initialized.');
});

export * from './events/Constants';
export {
    MongoDal,
    MongoConfig
}