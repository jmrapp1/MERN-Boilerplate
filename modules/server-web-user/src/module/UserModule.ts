import UserModuleContext from './UserModuleContext';
import { Module } from '@jrapp/server-core-module';
import UserModuleOptions from './UserModuleOptions';

export default class UserModule extends Module<UserModuleContext> {

    constructor(name: string, color: string) {
        super(name, color, new UserModuleContext());
    }

    registerUserModule(options: UserModuleOptions) {
        this.context.moduleOptions = options;
        super.registerModule();
    }

    registerModule() {
        throw new Error('Please use the registerUserModule function.');
    }
}