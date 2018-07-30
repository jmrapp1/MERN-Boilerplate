import * as _ from 'underscore';

export function mappedResourceToJson(resource, mapperId: string) {
    return {
        data: resource,
        mapperData: {
            mapperId,
            isArray: _.isArray(resource)
        }
    };
}

export default {
    mappedResourceToJson
}
