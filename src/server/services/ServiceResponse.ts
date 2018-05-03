/**
 * Ensures that there is a standard structure for service data return.
 * Allows us to test if the service failed and present any errors if there
 * were any. Otherwise we know we can use the data safely
 */
import { BadRequestError } from '../../shared/errors/BadRequestError';

export default class ServiceResponse {

    /** Whether or not the service method failed */
    failed;

    /** The data returned, either actual data or errors depending on if it failed or not */
    data;

    /**
     * Handles a service response and sets the data or error data depending on if it passed or failed
     *
     * @param data The data to pass with it (null by default)
     * @param failed If the service method failed
     */
    constructor(data = null, failed = false) {
        this.data = data;
        this.failed = failed;
    }

    /**
     * @returns {boolean} If the service call succeeded
     */
    isSuccess() {
        return !this.failed;
    }

    /**
     * @returns {boolean} If the service call failed
     */
    isFailed() {
        return this.failed;
    }

    /**
     * @returns {boolean} If the service data is empty
     */
    isEmpty() {
        return !this.data || (Array.isArray(this.data) && this.data.length === 0);
    }

    buildBadRequestError(): BadRequestError {
        return new BadRequestError(this.data);
    }

}
