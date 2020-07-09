import { Service } from 'typedi';
import { ModuleContext } from '@jrapp/server-core-module';

export const JWT_TOKEN_SECRET = 'JWT_TOKEN_SECRET';

@Service({global: false})
export default class UserModuleContext extends ModuleContext {

    constructor(name, color) {
        super(name, color);
    }

    setTokenSecret(secret: string) {
        this.set(JWT_TOKEN_SECRET, secret);
    }

    getTokenSecret() {
        return this.get(JWT_TOKEN_SECRET);
    }

}