import { ResourceMapper } from '@modulfy/shared-core-resources';
import JwtResource from '../resources/JwtResource';

class JwtMapper extends ResourceMapper {

    id = 'JwtMapper';
    resourceType = JwtResource;

    build(data): JwtResource {
        return new JwtResource().init(data.jwtToken);
    }

}

export default new JwtMapper();
