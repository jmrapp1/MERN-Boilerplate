import * as _ from 'underscore';
import ResourceMapper from '../../shared/mappers/ResourceMapper';

export function mappedResourceToJson(resource, mapper: ResourceMapper) {
    const isArray = _.isArray(resource);
    let data;
    if (isArray) data = resource.map(r => mapper.build(r));
    else data = mapper.build(resource);

    return {
        data,
        mapperData: {
            mapperId: mapper.id,
            isArray
        }
    };
}

export default {
    mappedResourceToJson
}
