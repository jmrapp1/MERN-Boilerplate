import * as mongoose from 'mongoose';
import { Logger } from '@jrapp/server-logging';

class MongoConfig {

    db;

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
                this.db = db;
                Logger.info('Connected to MongoDB');
                return resolve(db);
            });
        });
    }

    close() {
        return new Promise((resolve, reject) => {
            mongoose.connection.close(resolve);
        });
    }
}

export default new MongoConfig();