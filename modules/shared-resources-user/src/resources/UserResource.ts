import { Resource } from '@modulfy/shared-core-resources';

export default class UserResource extends Resource {

    username: string;
    firstName: string;
    lastName: string;
    email: string;

    init(username: string, firstName: string, lastName: string, email: string) {
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        return this;
    }

}
