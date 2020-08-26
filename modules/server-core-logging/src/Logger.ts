import * as Dates from '@jrapp/shared-dates';
import { Service } from 'typedi';
const chalk = require('chalk');

export const INFO_COLOR = '#89cff0';
export const WARN_COLOR = '#ff9100';
export const ERROR_COLOR = '#ff6961';
export const CRITICAL_COLOR = '#FF0000';

@Service({ global: false })
export default class Logger {

    name;
    color;

    info(msg) {
        console.log(chalk.hex(INFO_COLOR)(`[INFO ${Dates.now()}]`)
            + chalk.hex(this.color)(`[${this.name}] `)
            + msg);
    }

    warn(msg) {
        console.warn(chalk.hex(WARN_COLOR)(`[WARN ${Dates.now()}]`)
            + chalk.hex(this.color)(`[${this.name}] `)
            + chalk.hex(WARN_COLOR)(msg));
    }

    error(msg) {
        console.error(chalk.hex(ERROR_COLOR)(`[ERROR ${Dates.now()}]`)
            + chalk.hex(this.color)(`[${this.name}] `)
            + chalk.hex(ERROR_COLOR)(msg));
    }

    critical(msg) {
        console.error(chalk.hex(CRITICAL_COLOR)(`[CRITICAL ${Dates.now()}]`)
            + chalk.hex(this.color)(`[${this.name}] `)
            + chalk.hex(CRITICAL_COLOR)(msg));
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