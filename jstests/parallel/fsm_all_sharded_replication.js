'use strict';

load('jstests/parallel/fsm_libs/runner.js');

var dir = 'jstests/parallel/fsm_workloads';

var blacklist = [

    // Disabled due to known bugs
    'drop_database.js', // SERVER-16285
    'map_reduce_merge_nonatomic.js', // SERVER-16262
    'map_reduce_reduce_nonatomic.js', // SERVER-16262

    // Disabled due to MongoDB restrictions and/or workload restrictions
    'indexed_insert_eval.js', // eval doesn't work with sharded collections
    'indexed_insert_eval_nolock.js', // eval doesn't work with sharded collections
    'remove_single_document.js', // our .remove(query, {justOne: true}) calls lack shard keys

].map(function(file) { return dir + '/' + file; });

// SERVER-16196 re-enable executing workloads against sharded replica sets
// runWorkloadsSerially(ls(dir).filter(function(file) {
//     return !Array.contains(blacklist, file);
// }), { sharded: true, replication: true });
