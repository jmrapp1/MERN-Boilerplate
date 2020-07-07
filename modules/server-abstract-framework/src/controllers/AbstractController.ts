import * as _ from 'underscore';
import { Logger } from '@jrapp/server-logging';
import { InternalServerError } from '@jrapp/shared-resources';

export default abstract class AbstractController {

    handleServiceError(response, err) {
        if (_.isUndefined(err) || err == null) {
            Logger.critical(`Error did not exist. Internal Server Error. Data: ${ JSON.stringify(err) }`);
            response.status(500).json(new InternalServerError().getJson());
            return response;
        } else if (_.isUndefined(err.errorCode) || err.errorCode == null) {
            Logger.critical(`Unexpected, Internal Server Error. {data: ${err.data}, message: ${err.message || err.data.message}, stack: ${err.stack || err.data.stack})}`);
            response.status(500).json(new InternalServerError().getJson());
            return response;
        }
        Logger.warn('Error: ' + JSON.stringify(err));
        response.status(err.errorCode).json(err.buildError().getJson());
        return response;
    }

}
