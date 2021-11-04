import ServiceResponse from './response/ServiceResponse';
import * as mongoose from 'mongoose';
import PagedServiceResponse from './response/PagedServiceResponse';
import {Query} from "mongoose";

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
    async insert(body): Promise<ServiceResponse<T>> {
        try {
            const res = await this.model.create(body);
            return new ServiceResponse(res);
        } catch (e) {
            throw new ServiceResponse(e);
        }
    };

    /**
     * Delete an entry from the database based on the data
     * @param body The delete key-value constraints
     * @returns {Promise<ServiceResponse>}
     */
    async delete(body): Promise<ServiceResponse<any>> {
        try {
            await this.model.remove(body).exec();
            return new ServiceResponse();
        } catch (e) {
            throw new ServiceResponse(e);
        }
    }

    /**
     * Finds an entry by it's ID
     * @param id The ID
     * @param {any[]} populate Whether to perform any joins
     * @returns {Promise<ServiceResponse>} The found entry
     */
    async findById(id, populate = this.populate): Promise<ServiceResponse<T>> {
        try {
            const model = await this.populateQuery(this.model.find({_id: id}).limit(1), populate);
            if (model === undefined || model === null) {
                throw new ServiceResponse(`No entry found with ID: ${id}`, 400);
            }
            if (model instanceof Array) {
                if (model.length === 1) {
                    return new ServiceResponse(model[0]);
                } else if (model.length > 1) {
                    return new ServiceResponse(model[0]);
                }
                throw new ServiceResponse(`No entry found with ID: ${id}`, 400);
            }
            return new ServiceResponse(model);
        } catch (e) {
            if (e instanceof ServiceResponse) {
                throw e;
            }
            throw new ServiceResponse(e);
        }
    }

    /**
     * Joins data of a queried row
     * @param query The query to perform
     * @param populate The populating configurations used to join other tables
     * @returns {any} The query
     */
    private async populateQuery(query: Query<any, any>, populate) {
        const results = await query.exec();
        if (populate instanceof Array) {
            for (let i = 0; i < populate.length; i++) {
                await results.populate(populate[i]);
            }
        } else if (populate) {
            await results.populate(populate);
        }
        return results;
    }

    /**
     * Finds all rows and optionally populates them
     * @param {any[]} populate The populating configurations used to join other tables
     * @returns {Promise<ServiceResponse>} All found rows
     */
    async findAll(populate = this.populate): Promise<ServiceResponse<T[]>> {
        try {
            const models = await this.populateQuery(this.model.find({}), populate);
            return new ServiceResponse(models);
        } catch (e) {
            throw new ServiceResponse(e);
        }
    }

    /**
     * Count the total number of rows
     * @param {{}} query Select parameters
     * @returns {Promise<ServiceResponse>} The number of rows
     */
    async count(query = {}): Promise<ServiceResponse<number>> {
        try {
            const count = await this.model.countDocuments(query).exec();
            return new ServiceResponse(count);
        } catch (e) {
            throw new ServiceResponse(e);
        }
    };

    /**
     * Pages through rows of some given query
     * @param findParams Select parameters
     * @param limit The limit of rows to find
     * @param {number} offset The number of rows to offset
     * @param {any[]} populate The population configurations used to join other tables
     * @returns {Promise<ServiceResponse>} All found rows
     */
    async findWithLimit(findParams, limit, offset = 0, populate = this.populate, sort?): Promise<ServiceResponse<T[]>> {
        try {
            const query = this.model.find(findParams).skip(offset).limit(limit);
            if (sort) {
                query.sort(sort);
            }
            const models = await this.populateQuery(query, populate);
            return new ServiceResponse(models);
        } catch (e) {
            throw new ServiceResponse(e);
        }
    }

    async page(query, size, offset, populate = this.populate, sort?): Promise<PagedServiceResponse<T[]>> {
        try {
            const countRes = await this.count(query);
            const findRes = await this.findWithLimit(query, size, offset, populate, sort);
            return new PagedServiceResponse(findRes.data, null, countRes.data, offset, findRes.data.length);
        } catch (e) {
            throw new ServiceResponse(e);
        }
    }

    /**
     * Finds one matching row
     * @param findParams Select parameters
     * @param {any[]} populate The population configurations used to join other tables
     * @returns {Promise<ServiceResponse>} Found row
     */
    async findOne(findParams, populate = this.populate, sort?): Promise<ServiceResponse<T | string>> {
        try {
            const res = await this.findWithLimit(findParams, 1, 0, populate, sort)
            if (!res.isEmpty()) {
                return new ServiceResponse<T>(res.data[0]);
            }
            return new ServiceResponse('No data found.', 400);
        } catch (e) {
            throw new ServiceResponse(e);
        }
    }

    /**
     * Finds rows with some given query
     * @param findParams Select parameters
     * @param {any[]} populate The population configurations used to join other tables
     * @returns {Promise<ServiceResponse>} All found rows
     */
    async find(findParams, populate = this.populate): Promise<ServiceResponse<T[]>> {
        try {
            const models = await this.populateQuery(this.model.find(findParams), populate);
            return new ServiceResponse(models);
        } catch (e) {
            throw new ServiceResponse(e);
        }
    }

    /**
     * Updates an entry by ID with the new data
     * @param id The entry ID
     * @param body The data to update in the entry
     * @returns {Promise<ServiceResponse>} The updated entry
     */
    async updateById(id, body, getUpdatedModel = false): Promise<ServiceResponse<any>> {
        try {
            const modelRes = await this.findById(id);
            const updateRes = await modelRes.data.update(body).exec();
            if (getUpdatedModel) {
                return await this.findById(id);
            }
            return updateRes;
        } catch (e) {
            throw new ServiceResponse(e);
        }
    }

    /**
     * Deletes an entry by ID
     * @param id The entry ID
     * @returns {Promise<ServiceResponse>} If it was deleted or not
     */
    async deleteById(id): Promise<ServiceResponse<any>> {
        try {
            await this.model.findOneAndRemove({_id: id}).exec();
            return new ServiceResponse();
        } catch (e) {
            throw new ServiceResponse(e);
        }
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

}
