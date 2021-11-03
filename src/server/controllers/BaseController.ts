import * as _ from 'underscore';
import { InternalServerError } from '../../shared/errors/InternalServerError';

export default abstract class BaseController {

    handleServiceError(response, err) {
        if (_.isUndefined(err) || err == null) {
            response.status(500).json(new InternalServerError().getJson());
            return response;
        } else if (_.isUndefined(err.errorCode) || err.errorCode == null) {
            response.status(500).json(new InternalServerError().getJson());
            return response;
        }
        response.status(err.errorCode).json(err.buildError().getJson());
        return response;
    }

}
