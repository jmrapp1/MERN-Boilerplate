import { ModuleContext } from '../index';
import { Logger } from '@modulfy/server-core-logging';
import { Container, Service } from 'typedi';
import ModulesRegistry from '../ModulesRegistry';
import { buildLogger } from '@modulfy/server-core-logging/dist';

export default class Module<T extends ModuleContext> {

    private _name: string;
    private _color: string;
    private _context: T;
    private _logger: Logger;

    constructor(name: string, color: string, context: T) {
        this._name = name;
        this._color = color;
        this._context = context;
        this._logger = buildLogger(this.name, this._color);
    }

    registerModule() {
        Container.of(this._name).set(Module, this);
        Container.of(this._name).set(ModuleContext, this._context);
        ModulesRegistry.addModule(this);
    }

    get name(): string {
        return this._name;
    }

    get context(): T {
        return this._context;
    }

    get logger(): Logger {
        return this._logger;
    }
}