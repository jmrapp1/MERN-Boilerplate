import * as _ from 'underscore';
import { getMetadataArgsStorage } from 'routing-controllers';
import ResourceMapper from '../../shared/mappers/ResourceMapper';
import { BadRequestError } from '../../shared/errors/BadRequestError';

/**
 * Hacked the routing-controllers a bit to make this custom decorator work
 * Their custom decorator implementation does not complete the incoming request so the body is never there
 */
export function BuildResource(mapper: ResourceMapper, strict: boolean = true): Function {
    return function (object: Object, method: string, index: number) {
        getMetadataArgsStorage().params.push(( {
            type: 'body-param',
            object: object,
            method: method,
            index: index,
            parse: false,
            isTargetObject: true,
            required: true,
            transform: action => {
                const resource = ( mapper as any ).build(getRequestData(action.request));
                if (strict) {
                    const customError = mapper.verifyAllConstraints(resource);
                    if (customError) return sendErrorResponse(action, customError);
                }
                return resource;
            }
        } ) as any);
    };
}

function sendErrorResponse(action, error) {
    action.response.status(400).json(new BadRequestError(error).getJson());
    action.next(error);
    return null;
}

function getRequestData(request) {
    if (!_.isEmpty(request.body, true)) return request.body;
    if (!_.isEmpty(request.query, true)) return request.query;
    if (!_.isEmpty(request.params, true)) return request.params;
    return {};
}
