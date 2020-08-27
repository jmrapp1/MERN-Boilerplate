import { Module } from '@modulfy/server-core-module';
import BlogModuleContext from './BlogModuleContext';
import BlogModuleOptions from './BlogModuleOptions';

export default class BlogModule extends Module<BlogModuleContext> {

    constructor(name: string, color: string) {
        super(name, color, new BlogModuleContext());
    }

    registerBlogModule(options: BlogModuleOptions = new BlogModuleOptions()) {
        this.context.moduleOptions = options;
        super.registerModule();
    }

    registerModule() {
        throw new Error('Please use the registerBlogModule function.');
    }
}