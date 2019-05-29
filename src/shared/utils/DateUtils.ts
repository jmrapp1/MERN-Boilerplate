import * as moment from 'moment-timezone';

export const TIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss';
export const SERVER_TZ = moment.tz.guess();

export function now() {
    return nowMoment().format(TIME_FORMAT);
}

export function nowMoment() {
    return moment(moment.utc().toDate());
}

export default {
    now,
    nowMoment,
    SERVER_TZ,
    TIME_FORMAT
};
