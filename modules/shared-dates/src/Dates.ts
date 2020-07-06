import * as moment from 'moment-timezone';

export const TIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss';

export function now(format = TIME_FORMAT) {
    return nowMoment().format(format);
}

function nowMoment() {
    return moment(moment.utc().toDate());
}

export default {
    now,
    TIME_FORMAT
}