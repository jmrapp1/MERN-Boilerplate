import { ResourceMapper } from '@jrapp/shared-core-resources';
import PrivateUserResource from '../resources/PrivateUserResource';

class PrivateUserMapper extends ResourceMapper {

    id = 'PrivateUserMapper';
    resourceType = PrivateUserResource;

    build(data): PrivateUserResource {
        return new PrivateUserResource().init(data.username);
    }

    getUndefinedKeyResponse(key: string) {
        return 'Please enter your ' + key + '.';
    }

}

export default new PrivateUserMapper();
