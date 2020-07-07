import * as mongoose from 'mongoose';

export const testSchema = new mongoose.Schema({
    message: { type: String, unique: true }
});

export interface TestDocument extends mongoose.Document {
    _id: string;
    message: string;
}

const Test = mongoose.model<TestDocument>('Test', testSchema, 'Test');

export default Test;
