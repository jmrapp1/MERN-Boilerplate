import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';

(<any>mongoose).Promise = global.Promise;

export default class DatabaseSetup {

    private db;

    async setupDb() {
        dotenv.load({path: '.env'});
        await this.connectToDb(process.env.MONGODB_URI);
    }

    async setupTestDb(callback) {
        dotenv.load({path: '.env'});
        await this.connectToDb(process.env.MONGODB_TEST_URI);
    }

    async connectToDb(uri) {
        if (!uri) {
            throw 'No MongoDB URI provided. Please add MONGODB_URI to env file';
        }
        await mongoose.connect(uri);
        this.db = mongoose.connection;
        console.log('Connected to MongoDB');
    }

    async close(done) {
        await mongoose.connection.close();
        done();
    }

    async before(done) {
        await this.setupDb()
        done();
    }

    async after(done = null) {
        await this.db.close();
        await this.close(done);
    }
}
