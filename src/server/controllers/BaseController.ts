import * as _ from 'underscore';
import Logger from '../util/Logger';
import ServiceResponse from '../services/ServiceResponse';

export default abstract class BaseController {

    handleServiceError(response, err: ServiceResponse<any>) {
        if (_.isUndefined(err.errorCode)) {
            Logger.critical(`Error did not have status code. Internal Server Error. Data: ${ JSON.stringify(err.data) }`);
            err.errorCode = 500;
        }
        return response.status(err.errorCode).json(err.buildError().getJson());
    }

}
