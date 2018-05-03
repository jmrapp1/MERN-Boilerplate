import * as _ from 'underscore';

function findUndefinedResourceKey(resource) {
    const keys = Object.keys(resource);
    for (const k of keys) {
        if ((_.isUndefined(resource[k]) || _.isEmpty(resource[k])) && k !== 'validated') {
            return k;
        }
    }
}

export default abstract class ResourceMapper {

    abstract id;

    abstract build(data);

    getUndefinedKeyResponse(key: string) {
        return 'Missing value for key: "' + key + '" in request.';
    }

    verifyStrictConstraints(resource) {
    }

    verifyPopulatedResource(resource) {
        const undefinedKey = findUndefinedResourceKey(resource);
        if (!_.isUndefined(undefinedKey)) {
            return this.getUndefinedKeyResponse(undefinedKey);
        }
    }

    verifyAllConstraints(resource) {
        const valid = this.verifyPopulatedResource(resource) || this.verifyStrictConstraints(resource);
        if (valid) resource.validated = true;
        return valid;
    }

}
