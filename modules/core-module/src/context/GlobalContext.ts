import Context from './Context';
import { Service } from 'typedi';

export const DATABASE_KEY = "DATABASE";

@Service()
export default class GlobalContext extends Context {

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