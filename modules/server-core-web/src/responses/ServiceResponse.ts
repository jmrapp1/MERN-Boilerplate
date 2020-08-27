/**
 * Ensures that there is a standard structure for service data return.
 * Allows us to test if the service failed and present any errors if there
 * were any. Otherwise we know we can use the data safely
 */
import { BadRequestError, HttpError, InternalServerError } from '@jrapp/shared-core-resources';

export default class ServiceResponse<T> {

    /** The data returned, either actual data or errors depending on if it failed or not */
    data: T;

    /** Used when responding with an error. Specifies the HTTP status code */
    errorCode;

    /**
     * Handles a service response and sets the data or error data depending on if it passed or failed
     *
     * @param data The data to pass with it (null by default)
     * @param errorCode Used when responding with an error
     */
    constructor(data: T = null, errorCode = null) {
        this.data = data;
        this.errorCode = errorCode;
    }

    /**
     * @returns {boolean} If the service data is empty
     */
    isEmpty() {
        return !this.data || ( Array.isArray(this.data) && this.data.length === 0 );
    }

    buildError(): HttpError {
        if (this.errorCode === 400) return this.buildBadRequestError();
        return this.buildInternalServerError();
    }

    buildInternalServerError(): InternalServerError {
        return new InternalServerError();
    }

    buildBadRequestError(): BadRequestError {
        return new BadRequestError(this.data);
    }

}
