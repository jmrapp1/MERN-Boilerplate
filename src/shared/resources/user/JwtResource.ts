import { Resource } from '@jrapp/shared-resources';

export default class JwtResource extends Resource {

    jwtToken;

    init(jwtToken) {
        this.jwtToken = jwtToken;
        return this;
    }

}
