// noinspection JSUnusedLocalSymbols
const defaultCallback = (value, key, parent) => value;

const mapRecursive = (o, callback = defaultCallback, key, parent) => {
    const newVal = callback(o, key, o);
    if (newVal !== o)
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


const mapRecursiveLeaf = (o, callback = defaultCallback) => mapRecursive(o, (value, key, parent) => {
    if(typeof value === 'object')
        return value;

    return callback(value, key, parent);
});

// noinspection JSUnresolvedVariable
module.exports = {
    mapRecursiveLeaf,
    mapRecursive,
};
