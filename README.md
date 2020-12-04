# map-recursive
map-recursive

Transform object to other form, recursively.

This package has no dependency.

[![Build Status](https://travis-ci.org/Aha00a/map-recursive.svg?branch=master)](https://travis-ci.org/Aha00a/map-recursive)
[![Node.js CI](https://github.com/Aha00a/map-recursive/workflows/Node.js%20CI/badge.svg)](https://github.com/Aha00a/map-recursive/actions?query=workflow%3A%22Node.js+CI%22)

## mapRecursiveLeaf
```typescript
declare function mapRecursiveLeaf(
    o: object, 
    callback?: (
        value: boolean | number | string, 
        key?: boolean | number | string, 
        parent?: object
    ) => any
): object;     
```

### Parameters
* `o`: The object to transform.
* `callback`(optional): The function to process each item against. `callback` will be invoked for leaf nodes only. The returned value is added to new object.
  * `value`: The current value being processed in the object.
  * `key`(optional): The key of the current value being processed in the object.
  * `parent`(optional): The parent of the current value being processed in the object. 

### Return Value
A new object with each value being the result of the callback function.

### Usage
```javascript 
const mapRecursive = require('map-recursive');

mapRecursive.mapRecursiveLeaf(
    {a: 1, b: 2, c: 3,}, 
    v => v * 10
); // == {a: 10, b: 20, c: 30,}

mapRecursive.mapRecursiveLeaf(
    {a: {b: 1, c: [3, {d: 4, e: 5,}, 6], f: 7},},
    v => v * 10
); // === {a: {b: 10, c: [30, {d: 40, e: 50,}, 60], f: 70},}
```



## mapRecursiveKey
```typescript
declare function mapRecursiveKey(
    o: object, 
    callback?: (
        key: boolean | number | string, 
        value?: object, 
        parent?: object
    ) => boolean | number | string
): object;     
```                               

### Parameters
* `o`: The object to transform.
* `callback`(optional): The function to process each item against. `callback` will be invoked for internal nodes only. The returned key is added to new object.
  * `key`: The key of the current value being processed in the object.
  * `value`(optional): The current value being processed in the object.
  * `parent`(optional): The parent of the current value being processed in the object. 

### Return Value
A new object with each key being the result of the callback function.

### Usage
```javascript            
const mapRecursive = require('map-recursive');

mapRecursive.mapRecursiveKey(
    {a: {b: 1, c: [3, {d: 4, e: 5,}, 6], f: 7},},
    v => v + v
); // === {aa: {bb: 1, cc: [3, {dd: 4, ee: 5,}, 6], ff: 7},},

mapRecursive.mapRecursiveKey(
    {"@id": "id", name: "name", "@some": "some",},
    v => v.replace(/^@/, "")
); // === {id: "id", name: "name", some: "some",},
```





## mapRecursive
```typescript
declare function mapRecursive(
    o: object, 
    callback?: (
        value: any, 
        key?: boolean | number | string, 
        parent?: object
    ) => any,
    key?: boolean | number | string,
    parent?: object 
): object;     
```

### Parameters
* `o`: The object to transform.
* `callback`(optional): The function to process each item against. `callback` will be invoked for all nodes. The returned value is added to new object.
  * `value`: The current value being processed in the object.
  * `key`(optional): The key of the current value being processed in the object.
  * `parent`(optional): The parent of the current value being processed in the object. 
* `key`(optional): for internal use.
* `parent`(optional): for internal use.

### Return Value
A new object with each value being the result of the callback function.

### Usage
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
); // === {a: "id"}

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
); /* ===
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
*/
```
