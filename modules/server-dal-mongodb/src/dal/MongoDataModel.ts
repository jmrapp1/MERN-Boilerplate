import * as mongoose from 'mongoose';
import { IDataModel } from '@jrapp/server-dal-interface';

export default class MongoDataModel<T extends mongoose.Document> implements IDataModel<mongoose.Model<T>> {

    model: mongoose.Model<T>;
    schema: mongoose.Schema;

}