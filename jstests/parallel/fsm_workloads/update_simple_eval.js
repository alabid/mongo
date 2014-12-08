'use strict';

/**
 * update_eval.js
 *
 * Creates several docs. On each iteration, each thread chooses:
 *  - a random doc
 *  - whether to $set or $unset its field
 *  - what value to $set the field to
 *  and then applies the update using db.runCommand({ eval: ... })
 */
load('jstests/parallel/fsm_libs/extend_workload.js'); // for extendWorkload
load('jstests/parallel/fsm_workloads/update_simple.js'); // for $config

var $config = extendWorkload($config, function($config, $super) {

    $config.data.doUpdate = function doUpdate(db, collName, query, updater) {
        var evalResult = db.runCommand({
            eval: function(f, collName, query, updater) {
                return tojson(f(db, collName, query, updater));
            },
            args: [$super.data.doUpdate, collName, query, updater],
            nolock: this.nolock
        });
        assert.commandWorked(evalResult);
        var res = JSON.parse(evalResult.retval);
        return res;
    };

    $config.data.nolock = false;

    // scale down threadCount and iterations because eval takes a global lock
    $config.threadCount = 20;
    $config.iterations = 10;

    return $config;
});
