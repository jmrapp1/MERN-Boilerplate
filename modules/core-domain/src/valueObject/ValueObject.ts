
export abstract class ValueObject<T> {

    protected _value: T;

    constructor(value: T) {
        this.validate(value);
        this._value = value;
    }

    public get value(): T {
        return this._value;
    }

    protected abstract validate(value: T): void;

    public abstract isEqualTo(value: ValueObject<T>): boolean;

}