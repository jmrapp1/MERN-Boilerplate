import * as _ from 'underscore';
import { BadRequestError } from './BadRequestError';

export function buildErrorFromJson(json: string) {
    const errorType = json['type'];
    const error = json['error'];
    if (errorType === 'BadRequest') return new BadRequestError(error);
}

export function isJsonError(json: string) {
    return !_.isUndefined(json) && !_.isUndefined(json['type']) && !_.isUndefined(json['error']);
}


export default {
    buildErrorFromJson,
    isJsonError
};
