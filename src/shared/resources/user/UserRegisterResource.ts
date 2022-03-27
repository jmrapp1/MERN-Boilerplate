import {Resource} from '../../decorators/resource';

@Resource
export class UserRegisterResource {

    username: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    password: string;
    confirmPassword: string;

    constructor(data: {username: string, email: string, firstName: string, lastName: string, phone: string, password: string, confirmPassword: string}) {
        this.username = data.username;
        this.email = data.email;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.phone = data.phone;
        this.password = data.password;
        this.confirmPassword = data.confirmPassword;
        return this;
    }

}
