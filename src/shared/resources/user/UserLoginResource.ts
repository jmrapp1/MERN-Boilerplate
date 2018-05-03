import Resource from '../Resource';

export default class UserLoginResource extends Resource {

    username: string;
    password: string;

    constructor(username: string, password: string) {
        super();
        this.username = username;
        this.password = password;
    }

}
