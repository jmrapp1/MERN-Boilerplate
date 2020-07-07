import { ResourceMapper } from '@jrapp/shared-resources';
import JwtResource from '../../resources/user/JwtResource';

class JwtMapper extends ResourceMapper {

    id = 'JwtMapper';
    resourceType = JwtResource;

    build(data): JwtResource {
        return new JwtResource().init(data.jwtToken);
    }

}

export default new JwtMapper();
