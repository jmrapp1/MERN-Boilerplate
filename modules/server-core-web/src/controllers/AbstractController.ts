import * as _ from 'underscore';
import { InternalServerError } from '@jrapp/shared-core-resources';

export default abstract class AbstractController {

    logger;

    constructor(logger) {
        this.logger = logger;
    }

    handleServiceError(response, err) {
        if (_.isUndefined(err) || err == null) {
            this.logger.critical(`Error did not exist. Internal Server Error. Data: ${ JSON.stringify(err) }`);
            response.status(500).json(new InternalServerError().getJson());
            return response;
        } else if (_.isUndefined(err.errorCode) || err.errorCode == null) {
            this.logger.critical(`Unexpected, Internal Server Error. {data: ${err.data}, message: ${err.message || err.data.message}, stack: ${err.stack || err.data.stack})}`);
            response.status(500).json(new InternalServerError().getJson());
            return response;
        }
        this.logger.warn(JSON.stringify(err));
        response.status(err.errorCode).json(err.buildError().getJson());
        return response;
    }

}
