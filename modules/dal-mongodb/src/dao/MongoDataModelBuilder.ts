import * as mongoose from 'mongoose';
import { DataModelBuilder } from '@modulfy/core-repository/dist';
import { MongoDataModel } from '../index';

export class MongoDataModelBuilder<T extends mongoose.Document> extends DataModelBuilder {

    private _events: {event: string, func: (...args: any[]) => void}[] = [];
    private _postEvents: {event: string, func: (...args: any[]) => void}[] = [];
    private _preEvents: {event: string, func: (...args: any[]) => void}[] = [];

    build(): MongoDataModel<T> {
        return new MongoDataModel(this);
    }

    onEvent(event: string, func: (...args: any[]) => void): MongoDataModelBuilder<T> {
        this._events.push({event, func});
        return this;
    }

    onPreEvent(event: string, func: (...args: any[]) => void): MongoDataModelBuilder<T> {
        this._preEvents.push({event, func});
        return this;
    }

    onPostEvent(event: string, func: (...args: any[]) => void): MongoDataModelBuilder<T> {
        this._postEvents.push({event, func});
        return this;
    }

    get events(): { event: string; func: (...args: any[]) => void }[] {
        return this._events;
    }

    get postEvents(): { event: string; func: (...args: any[]) => void }[] {
        return this._postEvents;
    }

    get preEvents(): { event: string; func: (...args: any[]) => void }[] {
        return this._preEvents;
    }
}