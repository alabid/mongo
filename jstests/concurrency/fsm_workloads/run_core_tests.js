'use strict';

/**
 * run_core_tests.js
 *
 * Base workload for running JS tests in jstests/core
 */
var $config = (function() {
    var data = {
        jsCoreDir: 'jstests/core'
    };

    var states = (function() {

        function getRandomTest() {
            var coreFile = this.jsCoreFiles[Random.randInt(this.jsCoreFiles.length)];
            jsTest.log(coreFile)
            return coreFile;
        }

        function loadRandomTest(db, collName) {
            // load random test in jstests/core
            load(getRandomTest.bind(this)());
        }

        return {
            loadRandomTest: loadRandomTest
        };

    })();

    function setup(db, collName) {
        this.jsCoreFiles = ls(this.jsCoreDir);
    };

    var transitions = {
        loadRandomTest: { loadRandomTest: 1 }
    };

    return {
        threadCount: 1,
        iterations: 100,
        states: states,
        startState: 'loadRandomTest',
        transitions: transitions,
        data: data,
        setup: setup
    };

})();
