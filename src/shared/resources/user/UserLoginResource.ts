import Resource from '../Resource';

export default class UserLoginResource extends Resource {

    username: string;
    password: string;

    init(username: string, password: string) {
        this.username = username;
        this.password = password;
        return this;
    }

}
