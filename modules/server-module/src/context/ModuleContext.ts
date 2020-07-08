import { Container, Service } from 'typedi';
import { buildLogger, Logger } from '@jrapp/server-logging';
import Context from './Context';

@Service({global: false})
export default class ModuleContext extends Context {

    name;
    color;
    logger: Logger;

    constructor(name, color) {
        super();
        this.name = name;
        this.color = color;
        this.logger = buildLogger(name, color);
    }
}