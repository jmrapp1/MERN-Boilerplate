import { Service } from 'typedi';

export const DATABASE_KEY = "DATABASE";

@Service()
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

    getDatabase() {
        return this.get(DATABASE_KEY);
    }

    setDatabase(db) {
        return this.set(DATABASE_KEY, db);
    }

    unsetDatabase() {
        return this.delete(DATABASE_KEY);
    }

}
