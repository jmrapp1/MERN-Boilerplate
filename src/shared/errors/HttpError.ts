
export default abstract class HttpError {

    abstract error: string;
    abstract type: string;

    abstract getType(): string;

    abstract getError(): string;

    getJson(): string {
        return JSON.stringify({
            type: this.getType(),
            error: this.getError()
        });
    }

}
