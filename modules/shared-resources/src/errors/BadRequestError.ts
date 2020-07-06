import HttpError from './HttpError';

export default class BadRequestError extends HttpError {

    error: any;
    type = 'BadRequest';

    constructor(error: any) {
        super();
        this.error = error;
    }

    getType(): string {
        return this.type;
    }

    getError(): any {
        return this.error;
    }

}
