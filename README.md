# map-recursive
map-recursive

Transform object to other form, recursively.

This package has no dependency.

[![Build Status](https://travis-ci.org/Aha00a/map-recursive.svg?branch=master)](https://travis-ci.org/Aha00a/map-recursive)
![Node.js CI](https://github.com/Aha00a/map-recursive/workflows/Node.js%20CI/badge.svg)

## mapRecursiveLeaf
mapRecursive.mapRecursiveLeaf(object, callback = (value, key, parent) => value)
* `object`: The object to transform
* `callback`: The function to process each item against. `callback` will be invoked for leaf nodes only.

```javascript 
const mapRecursive = require('map-recursive');

mapRecursive.mapRecursiveLeaf(
    {a: {b: 1, c: [3, {d: 4, e: 5,}, 6], f: 7},},
    v => v * 10
).should.deep.equal(
    {a: {b: 10, c: [30, {d: 40, e: 50,}, 60], f: 70},}
);
```

## mapRecursive
mapRecursive.mapRecursive(object, callback = (value, key, parent) => value)
* `object`: The object to transform
* `callback`: The function to process each item against. `callback` will be invoked for each nodes.
```javascript            
const mapRecursive = require('map-recursive');

const convertObjectOnlyHaveAtIdToString = v => {
    if (typeof v !== 'object')
        return v;

    const keys = Object.keys(v);
    if (keys.length !== 1)
        return v;

    if (keys[0] !== '@id')
        return v;

    return v['@id'];
};

mapRecursive.mapRecursive(
    {a: {"@id": "id"}}, 
    convertObjectOnlyHaveAtIdToString
).should.deep.equal(
    {a: "id"}
);

mapRecursive.mapRecursive(
    {
        "@id": "http://schema.org/preparation",
        "@type": "rdf:Property",
        "http://schema.org/domainIncludes": {
            "@id": "http://schema.org/MedicalProcedure"
        },
        "http://schema.org/isPartOf": {
            "@id": "http://health-lifesci.schema.org"
        },
        "http://schema.org/rangeIncludes": [
            {
                "@id": "http://schema.org/Text"
            },
            {
                "@id": "http://schema.org/MedicalEntity"
            }
        ],
        "rdfs:comment": "Typical preparation that a patient must undergo before having the procedure performed.",
        "rdfs:label": "preparation"
    },
    convertObjectOnlyHaveAtIdToString
).should.deep.equal(
    {
        "@id": "http://schema.org/preparation",
        "@type": "rdf:Property",
        "http://schema.org/domainIncludes": "http://schema.org/MedicalProcedure",
        "http://schema.org/isPartOf": "http://health-lifesci.schema.org",
        "http://schema.org/rangeIncludes": [
            "http://schema.org/Text",
            "http://schema.org/MedicalEntity"
        ],
        "rdfs:comment": "Typical preparation that a patient must undergo before having the procedure performed.",
        "rdfs:label": "preparation"
    }
);

```
## mapRecursiveKey
mapRecursive.mapRecursiveKey(object, callback = (value, key, parent) => value)
* `object`: The object to transform
* `callback`: The function to process each key against. `callback` will be invoked for internal nodes.
```javascript            
const mapRecursive = require('map-recursive');

mapRecursive.mapRecursiveKey(
    {a: {b: 1, c: [3, {d: 4, e: 5,}, 6], f: 7},},
    v => v + v
).should.deep.equal(
    {aa: {bb: 1, cc: [3, {dd: 4, ee: 5,}, 6], ff: 7},},
);

mapRecursive.mapRecursiveKey(
    {"@id": "id", name: "name", "@some": "some",},
    v => v.replace(/^@/, "")
).should.deep.equal(
    {id: "id", name: "name", some: "some",},
);
```

