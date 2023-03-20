// noinspection JSUnusedLocalSymbols
const mapRecursive = (o, callback = (value, key, parent) => value, key, parent) => {
    const newVal = callback(o, key, o);
    if (newVal === null || newVal !== o)
        return newVal;

    if(o instanceof Date)
        return newVal;

    if (Array.isArray(o)) {
        return o.map((val, key, array) => {
            if (typeof val === 'object')
                return mapRecursive(val, callback, key, array);

            return callback(val, key, array);
        });
    }

    if (typeof o === 'object') {
        return Object.keys(o).reduce((obj, key) => {
            const val = o[key];
            if (typeof val === 'object') {
                obj[key] = mapRecursive(val, callback, key, o);
            } else {
                obj[key] = callback(val, key, o);
            }
            return obj;
        }, {});
    }

    return callback(o, key, parent);
};


// noinspection JSUnusedLocalSymbols
const mapRecursiveLeaf = (o, callback = (value, key, parent) => value) => mapRecursive(o, (value, key, parent) => {
    if(value !== null && typeof value === 'object' && !(value instanceof Date))
        return value;

    return callback(value, key, parent);
});

// noinspection JSUnusedLocalSymbols
const mapRecursiveKey = (o, callback = (key, value, parent) => key, key, parent) => {
    if (Array.isArray(o)) {
        return o.map((val, key, array) => {
            if (typeof val === 'object')
                return mapRecursiveKey(val, callback, key, array);

            return val;
        });
    }

    if (typeof o === 'object') {
        return Object.keys(o).reduce((obj, key) => {
            const val = o[key];
            if (typeof val === 'object') {
                obj[callback(key, val, o)] = mapRecursiveKey(val, callback, key, o);
            } else {
                obj[callback(key, val, o)] = val;
            }
            return obj;
        }, {});
    }

    return o;
};


// noinspection JSUnresolvedVariable
module.exports = {
    mapRecursiveLeaf,
    mapRecursive,
    mapRecursiveKey,
};
