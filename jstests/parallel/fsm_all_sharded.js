'use strict';

load('jstests/parallel/fsm_libs/runner.js');

var dir = 'jstests/parallel/fsm_workloads';

var blacklist = [

    // Disabled due to known bugs
    'agg_match.js', // SERVER-3645 .count() can be wrong on sharded collections
    'drop_database.js', // SERVER-16285
    'map_reduce_merge_nonatomic.js', // SERVER-16262
    'map_reduce_reduce_nonatomic.js', // SERVER-16262

    // Disabled due to MongoDB restrictions and/or workload restrictions
    'agg_group_external.js', // uses >100MB of data, and is flaky
    'agg_sort_external.js', // uses >100MB of data, and is flaky
    'findAndModify_remove.js', // our findAndModify queries lack shard keys
    'findAndModify_update.js', // our findAndModify queries lack shard keys
    'findAndModify_update_collscan.js', // our findAndModify queries lack shard keys
    'findAndModify_update_grow.js', // our findAndModify queries lack shard keys
    'findAndModify_upsert.js', // our findAndModify queries lack shard keys
    'findAndModify_upsert_collscan.js', // our findAndModify queries lack shard keys
    'indexed_insert_eval.js', // eval doesn't work with sharded collections
    'indexed_insert_eval_nolock.js', // eval doesn't work with sharded collections
    'remove_single_document.js', // our .remove(query, {justOne: true}) calls lack shard keys
    'update_upsert_multi.js', // our update queries lack shard keys

].map(function(file) { return dir + '/' + file; });

// SERVER-16196 re-enable executing workloads against sharded clusters
// runWorkloadsSerially(ls(dir).filter(function(file) {
//     return !Array.contains(blacklist, file);
// }), { sharded: true });
