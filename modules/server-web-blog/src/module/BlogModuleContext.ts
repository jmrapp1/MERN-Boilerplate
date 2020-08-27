import { ModuleContext } from '@jrapp/server-core-module/dist';
import BlogModuleOptions from './BlogModuleOptions';

export default class BlogModuleContext extends ModuleContext {

    private _moduleOptions: BlogModuleOptions;

    get moduleOptions(): BlogModuleOptions {
        return this._moduleOptions;
    }

    set moduleOptions(value: BlogModuleOptions) {
        this._moduleOptions = value;
    }
}