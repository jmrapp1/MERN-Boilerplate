import * as _ from 'underscore';
/*
 * Provides a convenience extension to _.isEmpty which allows for
 * determining an object as being empty based on either the default
 * implementation or by evaluating each property to undefined, in
 * which case the object is considered empty.
 */
_.mixin( function() {
    // reference the original implementation
    const _isEmpty = _.isEmpty;
    return {
        // If defined is true, and value is an object, object is considered
        // to be empty if all properties are undefined, otherwise the default
        // implementation is invoked.
        isEmpty: (value, defined) => {
            if (defined && _.isObject(value)) {
                return !_.any( value, (val, key) => {
                    return val !== undefined;
                });
            }
            return _isEmpty(value);
        }
    }
}());