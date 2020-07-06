import * as Dates from '@jrapp/shared-dates';

export class Logger {

    info(msg) {
        console.log(`[INFO ${Dates.now()}] ${msg}`);
    }

    warn(msg) {
        console.warn(`[WARN ${Dates.now()}] ${msg}`);
    }

    error(msg) {
        console.error(`[ERROR ${Dates.now()}] ${msg}`);
    }

    critical(msg) {
        console.error(`[CRITICAL ${Dates.now()}] ${msg}`);
    }

}

export default new Logger();
