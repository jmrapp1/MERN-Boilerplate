import ResourceMapper from '../ResourceMapper';
import UserLoginResource from '../../resources/user/UserLoginResource';

class UserLoginMapper extends ResourceMapper {

    id = 'UserLoginMapper';

    build(data): UserLoginResource {
        return new UserLoginResource(data.username, data.password);
    }

    getUndefinedKeyResponse(key: string) {
        return 'Please enter your ' + key + '.';
    }

}

export default new UserLoginMapper();
