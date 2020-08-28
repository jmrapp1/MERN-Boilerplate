export class FetchMiddleware {

    private _fetchMiddlewares: ((route: string, method: string, body, headers) => {})[] = [];

    addFetchMiddleware(middleware: (route: string, method: string, body, headers) => {}) {
        this._fetchMiddlewares.push(middleware);
    }

    get fetchMiddlewares(): ((route: string, method: string, body, headers) => {})[] {
        return this._fetchMiddlewares;
    }

}