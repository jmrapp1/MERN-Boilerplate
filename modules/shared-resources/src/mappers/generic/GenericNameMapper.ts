import ResourceMapper from '../ResourceMapper';
import Resource from '../../resources/Resource';

class GenericNameMapper<T> extends ResourceMapper {

    id;
    resourceType: { new(): Resource };
    undefinedKeyResponse?: (key: string) => string;

    constructor(id: string, resourceType: { new(): Resource }, undefinedKeyResponse?: (key: string) => string) {
        super();
        this.id = id;
        this.resourceType = resourceType;
        this.undefinedKeyResponse = undefinedKeyResponse;
    }

    build(data): T {
        const resource = new this.resourceType();
        Object.keys(resource).forEach(key => {
            resource[key] = data[key];
        });
        return (resource as any);
    }

    getUndefinedKeyResponse(key: string) {
        return this.undefinedKeyResponse ? this.undefinedKeyResponse(key) : 'Please enter the ' + key + '.';
    }

}

export default GenericNameMapper;
