import ServiceResponse from './ServiceResponse';
import * as _ from 'lodash';
import Logger from '../util/Logger';

export default abstract class DatabaseService {

    /**
     * Represents the database model to be used
     */
    abstract model: any;
    populate = [];

    /**
     * Insert a new entry into the db table
     *
     * @param body The entry data
     * @returns {Promise<ServiceResponse>} If it was entered successfully
     */
    insert(body): Promise<ServiceResponse<any>> {
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
    findById(id, populate = this.populate): Promise<ServiceResponse<any>> {
        return this.promise((resolve, reject) => {
            this.populateQuery(this.model.find({ _id: id }).limit(1), populate).exec((err, model) => {
                if (err && !_.isEmpty(err)) {
                    return reject(new ServiceResponse(err));
                }
                if (model instanceof Array) {
                    if (model.length === 1) {
                        return resolve(new ServiceResponse(model[ 0 ]));
                    } else if (model.length > 1) {
                        Logger.critical(`Multiple rows found for ID: ${ id }. Returned Data: ${ JSON.stringify(model) }`);
                        return resolve(new ServiceResponse(model[ 0 ]));
                    }
                    return reject(new ServiceResponse(`No entry found with ID: ${id}`, 400));
                }
                if (_.isEmpty(model)) {
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
                query.populate(populate[ i ]);
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
    findAll(populate = this.populate): Promise<ServiceResponse<any>> {
        return this.promise((resolve, reject) =>
            this.populateQuery(this.model.find({}), populate).exec((err, models) => this.handleStandardResponse(resolve, reject, err, models))
        );
    }

    /**
     * Count the total number of rows
     * @param {{}} query Select parameters
     * @returns {Promise<ServiceResponse>} The number of rows
     */
    count(query = {}): Promise<ServiceResponse<any>> {
        return this.promise((resolve, reject) =>
            this.model.count(query).exec((err, count) => this.handleStandardResponse(resolve, reject, err, count))
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
    findWithLimit(findParams, limit, offset = 0, populate = this.populate): Promise<ServiceResponse<any>> {
        return this.promise((resolve, reject) =>
            this.populateQuery(this.model.find(findParams).skip(offset).limit(limit), populate)
                .exec((err, models) => this.handleStandardResponse(resolve, reject, err, models))
        );
    }

    /**
     * Finds rows with some given query
     * @param findParams Select parameters
     * @param {any[]} populate The population configurations used to join other tables
     * @returns {Promise<ServiceResponse>} All found rows
     */
    find(findParams, populate = this.populate): Promise<ServiceResponse<any>> {
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
                modelRes => modelRes.data.update(body, err => this.handleStandardResponse(resolve, reject, err)),
                reject);
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
        if (err && !_.isEmpty(err)) {
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
    promise(func) {
        return new Promise<ServiceResponse<any>>((resolve, reject) => func(resolve, reject));
    }

}
