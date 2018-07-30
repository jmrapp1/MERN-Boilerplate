import * as _ from 'underscore';
import { BadRequestError } from './BadRequestError';
import { InternalServerError } from './InternalServerError';

export function buildErrorFromJson(json: string) {
    const errorType = json['type'];
    const error = json['error'];
    if (errorType === 'BadRequest') return new BadRequestError(error);
    if (errorType === 'InternalServer') return new InternalServerError();
}

export function isJsonError(json: string) {
    return !_.isUndefined(json) && !_.isUndefined(json['type']) && !_.isUndefined(json['error']);
}


export default {
    buildErrorFromJson,
    isJsonError
};
