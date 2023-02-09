
define([
    //"./Aircraft_01LimitProvider_Test",
], function (
    //Aircraft_01LimitProvider
) {

    function Aircraft_01Plugin() {

        function getAircraft_01Dictionary() {
            return fetch('/example/Aircraft_01/Aircraft_01dictionary.json').then(function (response) {
                return response.json();
            });

        }

        // An object provider builds Domain Objects
        var Aircraft_01_objectProvider = {
            get: function (identifier) {
                return getAircraft_01Dictionary().then(function (dictionary) {
                    //console.log("Aircraft_01-dictionary-plugin.js: identifier.key = " + identifier.key);
                    if (identifier.key === 'Aircraft_01') {
                        return {
                            identifier: identifier,
                            name: dictionary.name,
                            type: 'folder',
                            location: 'ROOT'
                        };
                    } else {
                        var measurement = dictionary.measurements.filter(function (m) {
                            return m.key === identifier.key;
                        })[0];

                        return {
                            identifier: identifier,
                            name: measurement.name,
                            type: 'Aircraft_01.telemetry',
                            telemetry: {
                                values: measurement.values
                            },
                            location: 'Aircraft_01.taxonomy:Aircraft_01'
                        };
                    }
                });
            }
        };

        // The composition of a domain object is the list of objects it contains, as shown (for example) in the tree for browsing.
        // Can be used to populate a hierarchy under a custom root-level object based on the contents of a telemetry dictionary.
        // "appliesTo"  returns a boolean value indicating whether this composition provider applies to the given object
        // "load" returns an array of Identifier objects (like the channels this telemetry stream offers)
        var Aircraft_01_compositionProvider = {
            appliesTo: function (domainObject) {
                return domainObject.identifier.namespace === 'Aircraft_01.taxonomy'
                    && domainObject.type === 'folder';
            },
            load: function (domainObject) {
                return getAircraft_01Dictionary()
                    .then(function (dictionary) {
                        return dictionary.measurements.map(function (m) {
                            return {
                                namespace: 'Aircraft_01.taxonomy',
                                key: m.key
                            };
                        });
                    });
            }
        };

        return function install(openmct) {
            // The addRoot function takes an "object identifier" as an argument
            openmct.objects.addRoot({
                namespace: 'Aircraft_01.taxonomy',
                key: 'Aircraft_01'
            });

            openmct.objects.addProvider('Aircraft_01.taxonomy', Aircraft_01_objectProvider);

            openmct.composition.addProvider(Aircraft_01_compositionProvider);

            //openmct.telemetry.addProvider(new Aircraft_01LimitProvider());

            openmct.types.addType('Aircraft_01.telemetry', {
                name: 'Aircraft_01 Telemetry Point',
                description: 'Telemetry of Aircraft_01',
                cssClass: 'icon-telemetry'
            });
        };
    }

    return Aircraft_01Plugin;
});
