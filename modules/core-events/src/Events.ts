import { Service } from 'typedi';
const EventEmitter = require('events').EventEmitter;

const eventEmitter = new EventEmitter();

@Service()
export default class Events {

    once(event: string, func) {
        eventEmitter.once(event, func);
    }

    listen(event: string, func) {
        eventEmitter.on(event, func);
    }

    unlisten(event: string, func) {
        eventEmitter.off(event, func);
    }

    emit(event: string, data?) {
        eventEmitter.emit(event, data);
    }

}