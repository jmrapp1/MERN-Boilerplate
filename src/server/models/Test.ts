import * as mongoose from 'mongoose';

/**
 * Defines the test schema for the MongoDB database entries
 *
 * @type {mongoose.Schema}
 */
export const testSchema = new mongoose.Schema({
    test: { type: String, unique: true }
});

export interface TestDocument extends mongoose.Document {
    _id: string;
    test: string;
}

const Test = mongoose.model<TestDocument>('Test', testSchema, 'Test');

export default Test;
