export default class Context {

    values = {};

    has(key: string) {
        return this.values[key] !== undefined;
    }

    set(key: string, value: any) {
        this.values[key] = value;
        return value;
    }

    get(key: string): any {
        return this.values[key];
    }

    delete(key: string) {
        delete this.values[key];
    }

}
