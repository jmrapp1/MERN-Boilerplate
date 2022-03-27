import {Resource} from '../../decorators/resource';

@Resource
export class UserLoginResource {

    username: string;
    password: string;

    constructor(data: {username: string, password: string}) {
        this.username = data.username;
        this.password = data.password;
        return this;
    }

}
