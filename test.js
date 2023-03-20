require('chai').should();

const mapRecursive = require('.');
describe('mapRecursive', function () {
    it('mapRecursive', function () {
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

        mapRecursive.mapRecursive({"@id": "id"}, convertObjectOnlyHaveAtIdToString).should.deep.equal("id");
        mapRecursive.mapRecursive({"@id": "id", name: "name"}, convertObjectOnlyHaveAtIdToString).should.deep.equal({"@id": "id", name: "name"});
        mapRecursive.mapRecursive([{"@id": "id"}], convertObjectOnlyHaveAtIdToString).should.deep.equal(["id"]);
        mapRecursive.mapRecursive([[{"@id": "id"}]], convertObjectOnlyHaveAtIdToString).should.deep.equal([["id"]]);
        mapRecursive.mapRecursive([[{"@id": "id"}, {"@id": "id"}]], convertObjectOnlyHaveAtIdToString).should.deep.equal([["id", "id"]]);
        mapRecursive.mapRecursive([{"@id": "id"}, [{"@id": "id"}, {"@id": "id"}]], convertObjectOnlyHaveAtIdToString).should.deep.equal(["id", ["id", "id"]]);

        mapRecursive.mapRecursive({a: {"@id": "id"}}, convertObjectOnlyHaveAtIdToString).should.deep.equal({a: "id"});
        mapRecursive.mapRecursive({a: {b: {c: {"@id": "id"}}}}, convertObjectOnlyHaveAtIdToString).should.deep.equal({a: {b: {c: "id"}}});
        mapRecursive.mapRecursive(
            {a: {b: {c: {"@id": "id", name: 'name'}}}},
            convertObjectOnlyHaveAtIdToString
        ).should.deep.equal(
            {a: {b: {c: {"@id": "id", name: 'name'}}}}
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
    });

    it('mapRecursive', function () {
        mapRecursive.mapRecursive({
            id: 1,
            a: 2,
            b: 3,
            children: [
                {
                    id: 2,
                    a: 1,
                    b: 2,
                    children: [
                        {
                            id: 3,
                            a: 1,
                        }
                    ]
                }
            ]
        }, v => {
            if(typeof v !== 'object')
                return v;

            if(Array.isArray(v))
                return v;

            Object.keys(v).filter(k => !['id', 'children'].includes(k)).map(k => delete v[k]); // TODO: need to be pure function.
            return v;
        }).should.deep.equal({
            id: 1,
            children: [
                {
                    id: 2,
                    children: [
                        {
                            id: 3
                        }
                    ]
                }
            ]
        });
    });

    it('mapRecursiveLeaf(v)', function () {
        const now = new Date();

        (mapRecursive.mapRecursiveLeaf(null) === null).should.true;
        mapRecursive.mapRecursiveLeaf(1).should.equal(1);
        mapRecursive.mapRecursiveLeaf('a').should.equal('a');
        mapRecursive.mapRecursiveLeaf(now).should.equal(now);

        mapRecursive.mapRecursiveLeaf([]).should.deep.equal([]);
        mapRecursive.mapRecursiveLeaf([1, 2]).should.deep.equal([1, 2]);
        mapRecursive.mapRecursiveLeaf([1, 2, now]).should.deep.equal([1, 2, now]);

        mapRecursive.mapRecursiveLeaf({}).should.deep.equal({});
        mapRecursive.mapRecursiveLeaf({a: 1}).should.deep.equal({a: 1});
        mapRecursive.mapRecursiveLeaf({a: 1, b: 2}).should.deep.equal({a: 1, b: 2});
        mapRecursive.mapRecursiveLeaf({a: 1, b: 2, c: now}).should.deep.equal({a: 1, b: 2, c: now});
    });

    it('mapRecursiveLeaf(v, f)', function () {
        const now = new Date();

        mapRecursive.mapRecursiveLeaf(null, v => v + 1).should.equal(1);
        mapRecursive.mapRecursiveLeaf(1, v => v + 1).should.equal(2);
        mapRecursive.mapRecursiveLeaf('a', v => v + 1).should.equal('a1');
        mapRecursive.mapRecursiveLeaf(now, v => v + 1).should.equal(now + 1);

        mapRecursive.mapRecursiveLeaf([1, 2], v => v + 1).should.deep.equal([2, 3]);
        mapRecursive.mapRecursiveLeaf([1, [2, [3]]], v => v + 1).should.deep.equal([2, [3, [4]]]);
        mapRecursive.mapRecursiveLeaf([1, [2, [3]], 4], v => v + 1).should.deep.equal([2, [3, [4]], 5]);
        mapRecursive.mapRecursiveLeaf([1, [2, [3]], 4, now], v => v + 1).should.deep.equal([2, [3, [4]], 5, now + 1]);

        mapRecursive.mapRecursiveLeaf({a: null}, v => v + 1).should.deep.equal({a: 1});
        mapRecursive.mapRecursiveLeaf({a: 1}, v => v + 1).should.deep.equal({a: 2});
        mapRecursive.mapRecursiveLeaf({a: {b: 2}}, v => v + 1).should.deep.equal({a: {b: 3}});
        mapRecursive.mapRecursiveLeaf({a: {b: 2}, c: now}, v => v + 1).should.deep.equal({a: {b: 3}, c: now + 1});

        mapRecursive.mapRecursiveLeaf(
            {a: {b: 1, c: [3, {d: 4, e: 5,}, 6], f: 7}, g: 8, h: {i: null}, j: now},
            v => v * 10
        ).should.deep.equal(
            {a: {b: 10, c: [30, {d: 40, e: 50,}, 60], f: 70}, g: 80, h: {i: 0}, j: now * 10}
        );
    });

    it('mapRecursiveKey', function () {
        mapRecursive.mapRecursiveKey(1).should.deep.equal(1);

        mapRecursive.mapRecursiveKey(
            {a: {b: 1, c: [3, {d: 4, e: 5,}, 6], f: 7},}
        ).should.deep.equal(
            {a: {b: 1, c: [3, {d: 4, e: 5,}, 6], f: 7},}
        );
        mapRecursive.mapRecursiveKey(
            {a: {b: 1, c: [3, {d: 4, e: 5,}, 6], f: 7},},
            v => v + v
        ).should.deep.equal(
            {aa: {bb: 1, cc: [3, {dd: 4, ee: 5,}, 6], ff: 7},}
        );

        mapRecursive.mapRecursiveKey(
            {"@id": "id", name: "name", "@some": "some",},
            v => v.replace(/^@/, "")
        ).should.deep.equal(
            {id: "id", name: "name", some: "some",}
        );
    });
});
