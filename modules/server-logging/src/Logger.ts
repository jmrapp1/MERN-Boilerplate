import * as Dates from '@jrapp/shared-dates';
import { Container, Inject, Service } from 'typedi';
import { Events } from '@jrapp/server-events';
import { EVENT_LOGGER_CRITICAL, EVENT_LOGGER_ERROR, EVENT_LOGGER_INFO, EVENT_LOGGER_WARN } from './Events';
const chalk = require('chalk');

export const INFO_COLOR = '#89cff0';
export const WARN_COLOR = '#d99058';
export const ERROR_COLOR = '#ff6961';
export const CRITICAL_COLOR = '#FF0000';

@Service({ global: false })
export default class Logger {

    events: Events;
    name;
    color;

    constructor() {
        this.events = Container.get(Events);
    }

    info(msg) {
        console.log(chalk.hex(INFO_COLOR)(`[INFO ${Dates.now()}]`)
            + chalk.hex(this.color)(`[${this.name}] `)
            + msg);
        this.events.emit(EVENT_LOGGER_INFO, { module: this.name, msg });
    }

    warn(msg) {
        console.warn(chalk.hex(WARN_COLOR)(`[WARN ${Dates.now()}]`)
            + chalk.hex(this.color)(`[${this.name}] `)
            + chalk.hex(WARN_COLOR)(msg));
        this.events.emit(EVENT_LOGGER_WARN, { module: this.name, msg });
    }

    error(msg) {
        console.error(chalk.hex(ERROR_COLOR)(`[ERROR ${Dates.now()}]`)
            + chalk.hex(this.color)(`[${this.name}] `)
            + chalk.hex(ERROR_COLOR)(msg));
        this.events.emit(EVENT_LOGGER_ERROR, { module: this.name, msg });
    }

    critical(msg) {
        console.error(chalk.hex(CRITICAL_COLOR)(`[CRITICAL ${Dates.now()}]`)
            + chalk.hex(this.color)(`[${this.name}] `)
            + chalk.hex(CRITICAL_COLOR)(msg));
        this.events.emit(EVENT_LOGGER_CRITICAL, { module: this.name, msg });
    }

    setName(name) {
        this.name = name;
        return this;
    }

    setColor(color) {
        this.color = color;
        return this;
    }
}