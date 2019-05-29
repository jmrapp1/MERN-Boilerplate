import ResourceMapper from '../ResourceMapper';
import JwtResource from '../../resources/user/JwtResource';

class JwtMapper extends ResourceMapper {

    id = 'JwtMapper';
    resourceType = JwtResource;

    build(data): JwtResource {
        return new JwtResource().init(data.jwtToken);
    }

}

export default new JwtMapper();
