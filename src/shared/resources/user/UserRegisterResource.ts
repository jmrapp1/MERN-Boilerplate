import Resource from '../Resource';

export default class UserRegisterResource extends Resource {

    username: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    password: string;
    confirmPassword: string;

    init(username: string, email: string, firstName: string, lastName: string, phone: string, password: string, confirmPassword: string) {
        this.username = username;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phone = phone;
        this.password = password;
        this.confirmPassword = confirmPassword;
        return this;
    }

}
