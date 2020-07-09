import * as mongoose from 'mongoose';
import { Mongoose } from 'mongoose';
import { Container } from 'typedi';
import { Events } from '@jrapp/server-core-events';
import { MongoDataModel, MONGODB_CONNECTED } from '@jrapp/server-dal-mongodb/dist';

const testSchema = new mongoose.Schema({
    message: { type: String, unique: true }
});

export interface TestDocument extends mongoose.Document {
    _id: string;
    message: string;
}

const TestDataModel = new MongoDataModel<TestDocument>();
TestDataModel.schema = testSchema;

Container.get(Events).listen(MONGODB_CONNECTED, (conn: Mongoose) => {
    TestDataModel.model = conn.model<TestDocument>('Test', testSchema, 'Test');
});

export default TestDataModel;
