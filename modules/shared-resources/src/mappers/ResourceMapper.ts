import * as _ from 'underscore';
import Resource from '../resources/Resource';

const keyIgnores = ['validated'];

export default abstract class ResourceMapper {

    abstract id;
    abstract resourceType: { new(): Resource };

    abstract build(data);

    getUndefinedKeyResponse(key: string) {
        return 'Missing value for key: "' + key + '" in request.';
    }

    verifyStrictConstraints(resource) {
    }

    verifyPopulatedResource(resource) {
        const undefinedKey = this.findUndefinedResourceKey(resource);
        if (!_.isUndefined(undefinedKey)) {
            return this.getUndefinedKeyResponse(undefinedKey);
        }
    }

    verifyAllConstraints(resource) {
        const valid = this.verifyPopulatedResource(resource) || this.verifyStrictConstraints(resource);
        if (!valid) resource.validated = true;
        return valid;
    }

    findUndefinedResourceKey(resource) {
        const resourceType = new this.resourceType();
        const keys = Object.getOwnPropertyNames(resourceType);
        for (const k of keys) {
            const value = resource[k];
            if ((
                (typeof value !== typeof resourceType[k]) || // ensure same type
                (typeof value === 'undefined' || value === null) || // ensure not undefined
                (typeof value === 'string' && _.isEmpty(value)) // ensure not empty if string
            ) && keyIgnores.indexOf(k) < 0) { // ensure not a skipped key
                return k;
            }
        }
    }

}
