import {Resource} from '../../decorators/resource';

@Resource
export class JwtResource {

    jwtToken;

    constructor(data: {jwtToken}) {
        this.jwtToken = data.jwtToken;
        return this;
    }

}
