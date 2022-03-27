import * as _ from 'underscore';
import { getMetadataArgsStorage } from 'routing-controllers';
import {RESOURCE_REGISTRY} from "../../shared/decorators/resource";
import {newInstance} from "../../shared/utils/utils";

export function BuildResource(resource): Function {
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
                const resourceName = resource.RESOURCE_NAME;
                if (!resourceName) {
                    throw new Error('Error while building resource for request. Could not find the resource name. Make sure your resource is annotated with @Resource');
                }
                const reqData = getRequestData(action.request);
                const resourceRegistry = RESOURCE_REGISTRY[resourceName];

                const params = {}
                for (const param of resourceRegistry.params) {
                    params[param] = reqData[param];
                }
                return newInstance(resourceRegistry.constructor, params);
            }
        } ) as any);
    };
}

function getRequestData(request) {
    if (!_.isEmpty(request.body, true)) return request.body;
    if (!_.isEmpty(request.query, true)) return request.query;
    if (!_.isEmpty(request.params, true)) return request.params;
    return {};
}
