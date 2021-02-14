import { ModuleContext } from '@modulfy/core-module';
import UserModuleOptions from './UserModuleOptions';

export default class UserModuleContext extends ModuleContext {

    private _moduleOptions: UserModuleOptions;

    get moduleOptions(): UserModuleOptions {
        return this._moduleOptions;
    }

    set moduleOptions(value: UserModuleOptions) {
        this._moduleOptions = value;
    }
}