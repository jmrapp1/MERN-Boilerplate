import * as mongoose from 'mongoose';
import { Container } from 'typedi';
import { GlobalContext } from '@jrapp/server-module';
import { Events } from '@jrapp/server-events';
import { ModuleLogger, MONGODB_CONNECTED, MONGODB_DISCONNECTED } from '..';

class MongoConfig {

    connection;
    globalContext;
    events;

    constructor() {
        this.globalContext = Container.get(GlobalContext);
        this.events = Container.get(Events);
    }

    connect(uri: string) {
        return new Promise((resolve, reject) => {
            mongoose.set('useCreateIndex', true);
            mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
            const db = mongoose.connection;
            (<any>mongoose).Promise = global.Promise;

            db.on('error', (e) => {
                ModuleLogger.error('Could not connect to MongoDB: ' + e);
                reject(e);
            });
            db.once('open', () => {
                this.connection = db;
                this.globalContext.setDatabase(db);
                this.events.emit(MONGODB_CONNECTED, db);
                ModuleLogger.info('Connected to MongoDB');
                return resolve(db);
            });
        });
    }

    close() {
        return new Promise((resolve, reject) => {
            mongoose.connection.close(() => {
                this.globalContext.unsetDatabase();
                this.events.emit(MONGODB_DISCONNECTED);
                resolve();
            });
        });
    }
}

export default new MongoConfig();