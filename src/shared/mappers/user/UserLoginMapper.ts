import { ResourceMapper } from '@jrapp/shared-core-resources';
import UserLoginResource from '../../resources/user/UserLoginResource';

class UserLoginMapper extends ResourceMapper {

    id = 'UserLoginMapper';
    resourceType = UserLoginResource;

    build(data): UserLoginResource {
        return new UserLoginResource().init(data.username, data.password);
    }

    getUndefinedKeyResponse(key: string) {
        return 'Please enter your ' + key + '.';
    }

}

export default new UserLoginMapper();
