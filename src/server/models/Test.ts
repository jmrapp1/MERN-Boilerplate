import * as mongoose from 'mongoose';

/**
 * Defines the test schema for the MongoDB database entries
 *
 * @type {mongoose.Schema}
 */
export const testSchema = new mongoose.Schema({
    test: { type: String, unique: true }
});

const Test = mongoose.model('Test', testSchema, 'Test');

export default Test;
