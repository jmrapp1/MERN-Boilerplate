import { DataModel } from '@modulfy/core-repository';
import { Field } from '@modulfy/core-repository';
import * as mongoose from 'mongoose';
import { MongoDataModelBuilder } from './MongoDataModelBuilder';
import DataModelBuilder from '@modulfy/core-repository/dist/dao/DataModelBuilder';

export default class MongoDataModel<T extends mongoose.Document> extends DataModel {

    protected _schema: mongoose.Schema;
    protected _model: mongoose.Model<T>;

    constructor(builder: DataModelBuilder) {
        super(builder);
        const allFields = this.fields
            .map(({ name, type }) => this.processField(name, type))
            .reduce((schema, field) => ({ ...schema, ...field }), {});
        this._schema = new mongoose.Schema(allFields);
        console.log('Schema: ' + JSON.stringify(allFields));
        if (builder instanceof MongoDataModelBuilder) {
            builder.events.forEach(({event, func}) => this._schema.on(event, func));
            builder.preEvents.forEach(({event, func}) => this._schema.pre(event, func));
            builder.postEvents.forEach(({event, func}) => this._schema.post(event, func));
        }
        this._model = mongoose.model<T>(this.modelName, this._schema, this.modelName);
    }

    protected processField(name: string, field: Field<any>) {
        const fieldObj = {};
        fieldObj[name] = {
            type: field.getType(),
            index: field.options.index,
            unique: field.options.unique,
            default: field.options.defaultValue
        };
        return fieldObj;
    }

    get model(): mongoose.Model<T> {
        return this._model;
    }

    get schema() {
        return this._schema;
    }

}