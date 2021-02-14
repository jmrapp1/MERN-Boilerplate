import Logger from './Logger';
import { Container } from 'typedi';

function buildLogger(name, color): Logger {
    const logger = new Logger().setName(name).setColor(color);
    Container.of(name).set(Logger, logger);
    return logger;
}

export * from './Logger';
export {
    Logger,
    buildLogger
}