import { DateVO, Id } from '../valueObject';

export abstract class Entity<Props> {

    protected readonly _id: Id;
    protected readonly _props: Props;
    protected readonly _createdAt: DateVO;
    protected _updatedAt: DateVO;

    constructor(props: Props) {
        this.validateDefined(props);
        this.validateProps(props);
        this._props = props;
        this._createdAt = DateVO.now();
    }

    protected validateDefined(props: Props): void {
        if (typeof props === 'undefined' || props === null) {
            throw new Error('Entity props not provided.');
        }
    }

    public abstract validateProps(props: Props): void;

}