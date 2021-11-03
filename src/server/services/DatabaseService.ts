import ServiceResponse from './response/ServiceResponse';
import * as mongoose from 'mongoose';
import PagedServiceResponse from './response/PagedServiceResponse';

export default class DatabaseService<T extends mongoose.Document> {

    /**
     * Represents the database model to be used
     */
    model: mongoose.Model<any>;
    populate = [];

    /**
     * Insert a new entry into the db table
     *
     * @param body The entry data
     * @returns {Promise<ServiceResponse>} If it was entered successfully
     */
    insert(body): Promise<ServiceResponse<T>> {
        return this.promise((resolve, reject) => {
            this.model.create(body, (err, model) => this.handleStandardResponse(resolve, reject, err, model));
        });
    };

    /**
     * Delete an entry from the database based on the data
     * @param body The delete key-value constraints
     * @returns {Promise<ServiceResponse>}
     */
    delete(body): Promise<ServiceResponse<any>> {
        return this.promise((resolve, reject) => {
            this.model.remove(body, err => this.handleStandardResponse(resolve, reject, err));
        });
    }

    /**
     * Finds an entry by it's ID
     * @param id The ID
     * @param {any[]} populate Whether to perform any joins
     * @returns {Promise<ServiceResponse>} The found entry
     */
    findById(id, populate = this.populate): Promise<ServiceResponse<T>> {
        return this.promise((resolve, reject) => {
            this.populateQuery(this.model.find({ _id: id }).limit(1), populate).exec((err, model) => {
                if (err && err !== undefined && err !== null) {
                    return reject(new ServiceResponse(err));
                }
                if (model instanceof Array) {
                    if (model.length === 1) {
                        return resolve(new ServiceResponse(model[0]));
                    } else if (model.length > 1) {
                        return resolve(new ServiceResponse(model[0]));
                    }
                    return reject(new ServiceResponse(`No entry found with ID: ${id}`, 400));
                }
                if (model === undefined || model === null) {
                    return reject(new ServiceResponse(`No entry found with ID: ${id}`, 400));
                }
                return resolve(new ServiceResponse(model));
            });
        });
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
        } else if (populate && populate != null) {
            query.populate(populate);
        }
        return query;
    }

    /**
     * Finds all rows and optionally populates them
     * @param {any[]} populate The populating configurations used to join other tables
     * @returns {Promise<ServiceResponse>} All found rows
     */
    findAll(populate = this.populate): Promise<ServiceResponse<T[]>> {
        return this.promise((resolve, reject) =>
            this.populateQuery(this.model.find({}), populate).exec((err, models) => this.handleStandardResponse(resolve, reject, err, models))
        );
    }

    /**
     * Count the total number of rows
     * @param {{}} query Select parameters
     * @returns {Promise<ServiceResponse>} The number of rows
     */
    count(query = {}): Promise<ServiceResponse<number>> {
        return this.promise((resolve, reject) =>
            this.model.countDocuments(query).exec((err, count) => this.handleStandardResponse(resolve, reject, err, count))
        );
    };

    /**
     * Pages through rows of some given query
     * @param findParams Select parameters
     * @param limit The limit of rows to find
     * @param {number} offset The number of rows to offset
     * @param {any[]} populate The population configurations used to join other tables
     * @returns {Promise<ServiceResponse>} All found rows
     */
    findWithLimit(findParams, limit, offset = 0, populate = this.populate, sort?): Promise<ServiceResponse<T[]>> {
        return this.promise((resolve, reject) => {
                const query = this.model.find(findParams).skip(offset).limit(limit);
                if (sort) query.sort(sort);
                return this.populateQuery(query, populate)
                    .exec((err, models) => this.handleStandardResponse(resolve, reject, err, models))
            }
        );
    }

    page(query, size, offset, populate = this.populate, sort?): Promise<PagedServiceResponse<T[]>> {
        return new Promise<PagedServiceResponse<any>>((resolve, reject) => {
            this.count(query).then(countRes => {
                this.findWithLimit(query, size, offset, populate, sort).then(findRes => {
                    resolve(new PagedServiceResponse(findRes.data, null, countRes.data, offset, findRes.data.length));
                }).catch(reject);
            }).catch(reject);
        });
    }

    /**
     * Finds one matching row
     * @param findParams Select parameters
     * @param {any[]} populate The population configurations used to join other tables
     * @returns {Promise<ServiceResponse>} Found row
     */
    findOne(findParams, populate = this.populate, sort?): Promise<ServiceResponse<T>> {
        return this.promise((resolve, reject) =>
            this.findWithLimit(findParams, 1, 0, populate, sort).then(res => {
                if (!res.isEmpty()) return resolve(new ServiceResponse<T>(res.data[0]));
                return reject(new ServiceResponse('No data found.', 400));
            }).catch(reject)
        );
    }

    /**
     * Finds rows with some given query
     * @param findParams Select parameters
     * @param {any[]} populate The population configurations used to join other tables
     * @returns {Promise<ServiceResponse>} All found rows
     */
    find(findParams, populate = this.populate): Promise<ServiceResponse<T[]>> {
        return this.promise((resolve, reject) =>
            this.populateQuery(this.model.find(findParams), populate).exec((err, models) => this.handleStandardResponse(resolve, reject, err, models))
        );
    }

    /**
     * Updates an entry by ID with the new data
     * @param id The entry ID
     * @param body The data to update in the entry
     * @returns {Promise<ServiceResponse>} The updated entry
     */
    updateById(id, body): Promise<ServiceResponse<any>> {
        return this.promise((resolve, reject) => {
            this.findById(id).then(
                modelRes => modelRes.data.update(body, err => this.handleStandardResponse(resolve, reject, err)).catch(reject)
            ).catch(reject);
        });
    }

    /**
     * Deletes an entry by ID
     * @param id The entry ID
     * @returns {Promise<ServiceResponse>} If it was deleted or not
     */
    deleteById(id): Promise<ServiceResponse<any>> {
        return this.promise((resolve, reject) =>
            this.model.findOneAndRemove({ _id: id }, (err, model) => this.handleStandardResponse(resolve, reject, err, model))
        );
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
        if (err && err !== undefined && err !== null) {
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
