import * as mongoose from 'mongoose';
import { Container } from 'typedi';
import { Logger } from '@jrapp/server-logging';
import { Context } from '@jrapp/server-context';
import { Events } from '@jrapp/server-events';
import { MONGODB_CONNECTED, MONGODB_DISCONNECTED } from '../events/Constants';

class MongoConfig {

    connection;
    context;
    events;

    constructor() {
        this.context = Container.get(Context);
        this.events = Container.get(Events);
    }

    connect(uri: string) {
        return new Promise((resolve, reject) => {
            mongoose.connect(uri);
            const db = mongoose.connection;
            (<any>mongoose).Promise = global.Promise;

            db.on('error', (e) => {
                Logger.error('Could not connect to MongoDB: ' + e);
                reject(e);
            });
            db.once('open', () => {
                this.connection = db;
                this.context.setDatabase(db);
                this.events.emit(MONGODB_CONNECTED, db);
                Logger.info('Connected to MongoDB');
                return resolve(db);
            });
        });
    }

    close() {
        return new Promise((resolve, reject) => {
            mongoose.connection.close(() => {
                this.context.unsetDatabase();
                this.events.emit(MONGODB_DISCONNECTED);
                resolve();
            });
        });
    }
}

export default new MongoConfig();