import HttpError from './HttpError';

export class BadRequestError extends HttpError {

    error: string;
    type = 'BadRequest';

    constructor(error: string) {
        super();
        this.error = error;
    }

    getType(): string {
        return this.type;
    }

    getError(): string {
        return this.error;
    }

}
