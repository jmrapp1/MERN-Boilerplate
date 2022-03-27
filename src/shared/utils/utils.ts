export function newInstance(clazz, ...args) {
    return new (Function.prototype.bind.apply(clazz, [{}, ...args]));
}
