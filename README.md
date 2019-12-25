# map-recursive
map-recursive

This package has no dependency.

## mapRecursiveLeaf
```javascript 

mapRecursive.mapRecursiveLeaf(
    {a: {b: 1, c: [3, {d: 4, e: 5,}, 6], f: 7},},
    v => v * 10
).should.deep.equal(
    {a: {b: 10, c: [30, {d: 40, e: 50,}, 60], f: 70},}
);


```

## mapRecursive
```javascript            
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

