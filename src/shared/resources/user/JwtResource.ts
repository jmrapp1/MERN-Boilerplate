import Resource from '../Resource';

export default class JwtResource extends Resource {

    jwtToken;

    constructor(jwtToken) {
        super();
        this.jwtToken = jwtToken;
    }

}
