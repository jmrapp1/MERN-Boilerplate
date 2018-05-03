import Resource from '../Resource';

export default class TestResource extends Resource {

    message;

    constructor(message: string) {
        super();
        this.message = message;
    }

}
