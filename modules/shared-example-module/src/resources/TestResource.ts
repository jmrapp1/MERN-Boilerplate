import { Resource } from '@jrapp/shared-resources';

export default class TestResource extends Resource {

    message;

    init(message: string) {
        this.message = message;
        return this;
    }

}
