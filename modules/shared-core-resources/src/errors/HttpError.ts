
export default abstract class HttpError {

    abstract error: string;
    abstract type: string;

    abstract getType(): string;

    abstract getError(): string;

    getJson() {
        return {
            type: this.getType(),
            error: this.getError()
        };
    }

}
