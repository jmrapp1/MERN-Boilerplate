import { DateTime } from 'luxon';
import { ValueObject } from '../ValueObject';

export class DateVO extends ValueObject<Date>{

    constructor(value: Date | DateTime | string) {
        if (typeof value === 'string') {
            const dt = DateTime.fromISO(value);
            if (!dt.isValid) {
                throw new Error(`Invalid ISO date '${value}'`);
            }
            value = dt.toJSDate();
        } else if (value instanceof DateTime) {
            value = value.toJSDate();
        }
        super(value);
    }

    protected validate(value: Date): void {
    }

    isEqualTo(date: DateVO): boolean {
        return date.value.getTime() === this._value.getTime();
    }

    static now() {
        return new DateVO(DateTime.utc());
    }

}