import { Resource } from '@jrapp/shared-core-resources';

export default class PrivateUserResource extends Resource {

    username: string;

    init(username: string) {
        this.username = username;
        return this;
    }

}
