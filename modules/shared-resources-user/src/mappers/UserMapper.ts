import { ResourceMapper } from '@jrapp/shared-core-resources';
import UserLoginResource from '../resources/UserLoginResource';
import UserResource from '../resources/UserResource';

class UserMapper extends ResourceMapper {

    id = 'UserMapper';
    resourceType = UserResource;

    build(data): UserResource {
        return new UserResource().init(data.username, data.firstName, data.lastName, data.email);
    }

    getUndefinedKeyResponse(key: string) {
        return 'Please enter your ' + key + '.';
    }

}

export default new UserMapper();
