import * as mongoose from 'mongoose';
import { IDataAccessLayer } from '@jrapp/server-dal-interface';
import { ServiceResponse } from '@jrapp/server-web-framework';
import MongoDataModel from './MongoDataModel';
import { ModuleLogger } from '../index';

export default class MongoDal<T extends mongoose.Document> implements IDataAccessLayer {

    dataModel: MongoDataModel<T>;
    populate: string[];

    constructor(dataModel: MongoDataModel<T>, populate = []) {
        this.dataModel = dataModel;
        this.populate = [];
    }

    insert(body: any): Promise<ServiceResponse<T>> {
        return this.promise((resolve, reject) => {
            this.dataModel.model.create(body, (err, model) => this.handleStandardResponse(resolve, reject, err, model));
        });
    };

    save(model: any): Promise<ServiceResponse<T>> {
        return this.promise((resolve, reject) => {
            model.save(err => {
                if (err) {
                    return reject(new ServiceResponse(err));
                }
                return resolve(new ServiceResponse(model));
            });
        });
    }

    updateById(id: string, updates): Promise<ServiceResponse<T>> {
        return this.promise((resolve, reject) => {
            this.findById(id).then(
                modelRes => modelRes.data.update(updates, err => this.handleStandardResponse(resolve, reject, err)).catch(reject)
            ).catch(reject);
        });
    }

    delete(query): Promise<ServiceResponse<T>> {
        return this.promise((resolve, reject) => {
            this.dataModel.model.remove(query, err => this.handleStandardResponse(resolve, reject, err));
        });
    }

    deleteById(id: string): Promise<ServiceResponse<T>> {
        return this.promise((resolve, reject) =>
            (this.dataModel.model as any).findOneAndRemove({ _id: id }, (err, model) => this.handleStandardResponse(resolve, reject, err, model))
        );
    }

    findById(id: string): Promise<ServiceResponse<T>> {
        return this.promise((resolve, reject) => {
            this.populateQuery((this.dataModel.model as any).find({ _id: id }).limit(1), this.populate).exec((err, model) => {
                if (err) {
                    return reject(new ServiceResponse(err));
                }
                if (model instanceof Array) {
                    if (model.length === 1) {
                        return resolve(new ServiceResponse(model[0]));
                    } else if (model.length > 1) {
                        ModuleLogger.critical(`Multiple rows found for ID: ${ id }. Returned Data: ${ JSON.stringify(model) }`);
                        return resolve(new ServiceResponse(model[0]));
                    }
                    return reject(new ServiceResponse(`No entry found with ID: ${id}`, 400));
                }
                if (model) {
                    return resolve(new ServiceResponse(model));
                }
                return reject(new ServiceResponse(`No entry found with ID: ${id}`, 400));
            });
        });
    }

    find(query, size: number, offset = 0, sort?): Promise<ServiceResponse<T[]>> {
        return this.promise((resolve, reject) => {
                const req = this.dataModel.model.find(query).skip(offset).limit(size);
                if (sort) req.sort(sort);
                return this.populateQuery(req, this.populate)
                    .exec((err, models) => this.handleStandardResponse(resolve, reject, err, models))
            }
        );
    }

    count(query): Promise<ServiceResponse<number>> {
        return this.promise((resolve, reject) =>
            this.dataModel.model.countDocuments(query)
                .exec((err, count) => this.handleStandardResponse(resolve, reject, err, count))
        );
    }

    /**
     * Joins data of a queried row
     * @param query The query to perform
     * @param populate The populating configurations used to join other tables
     * @returns {any} The query
     */
    private populateQuery(query, populate) {
        if (populate instanceof Array) {
            for (let i = 0; i < populate.length; i++) {
                query.populate(populate[i]);
            }
        } else if (populate) {
            query.populate(populate);
        }
        return query;
    }

    /**
     * Handles the error response sent back from a mongoose query
     * @param resolve promise resolve
     * @param reject promise reject
     * @param err The error
     * @param {any} model The model
     * @returns {ServiceResponse} A service response based on if there was an error or not
     */
    handleStandardResponse(resolve, reject, err, model = null): ServiceResponse<any> {
        if (err) {
            return reject(new ServiceResponse(err));
        }
        return resolve(new ServiceResponse(model));
    }

    /**
     * Helper function to standardize promise and it's return type
     *
     * @param func The function to call in the promise
     * @returns {Promise<ServiceResponse>} The promise
     */
    promise(func: (resolve, reject) => void): Promise<ServiceResponse<any>> {
        return new Promise<ServiceResponse<any>>((resolve, reject) => func(resolve, reject));
    }

    handleCaught(e, reject, res) {
        if (e instanceof ServiceResponse) {
            return reject(res);
        }
        return reject(e);
    }

}