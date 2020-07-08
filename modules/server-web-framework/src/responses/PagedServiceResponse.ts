import ServiceResponse from './ServiceResponse';

export default class PagedServiceResponse<T> extends ServiceResponse<T> {

    total: number;
    offset: number;
    size: number;

    constructor(data: T = null, errorCode = null, total: number, offset: number, size: number) {
        super(data, errorCode);
        this.total = total;
        this.offset = offset;
        this.size = size;
    }


}
