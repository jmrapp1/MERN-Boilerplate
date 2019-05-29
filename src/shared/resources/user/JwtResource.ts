import Resource from '../Resource';

export default class JwtResource extends Resource {

    jwtToken;

    init(jwtToken) {
        this.jwtToken = jwtToken;
        return this;
    }

}
