import { Resource } from '@jrapp/shared-resources';

export default class UserLoginResource extends Resource {

    username: string;
    password: string;

    init(username: string, password: string) {
        this.username = username;
        this.password = password;
        return this;
    }

}
