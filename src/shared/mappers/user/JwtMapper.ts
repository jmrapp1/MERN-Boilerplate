import ResourceMapper from '../ResourceMapper';
import JwtResource from '../../resources/user/JwtResource';

class JwtMapper extends ResourceMapper {

    id = 'JwtMapper';

    build(data): JwtResource {
        return new JwtResource(data.jwtToken);
    }

}

export default new JwtMapper();
