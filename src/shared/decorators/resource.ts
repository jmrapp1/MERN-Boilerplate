import {newInstance} from "../utils/utils";

export const RESOURCE_REGISTRY: {
    [name: string]: {
        constructor: Function,
        params: string[]
    }
} = {};

export function Resource(constructor: Function) {
    const params = Object.getOwnPropertyNames(newInstance(constructor, {}));
    constructor['RESOURCE_NAME'] = constructor.name;
    RESOURCE_REGISTRY[constructor.name] = {
        constructor,
        params
    };
}
