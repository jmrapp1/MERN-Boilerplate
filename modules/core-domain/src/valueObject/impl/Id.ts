import { v4 as uuid } from 'uuid';
import { ValueObject } from '../ValueObject';

export class Id extends ValueObject<String> {

    constructor(value: String) {
        super(value);
    }

    isEqualTo(value: ValueObject<String>): boolean {
        return value.value === this._value;
    }

    protected validate(value: String): void {
        if (typeof value === 'undefined' || value === null || value.length === 0) {
            throw new Error('Please provide a valid ID value.');
        }
    }

    static generateId(): Id {
        return new Id(uuid());
    }

}