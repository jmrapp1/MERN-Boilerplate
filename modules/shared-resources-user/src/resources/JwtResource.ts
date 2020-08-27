import { Resource } from '@modulfy/shared-core-resources';

export default class JwtResource extends Resource {

    jwtToken;

    init(jwtToken) {
        this.jwtToken = jwtToken;
        return this;
    }

}
