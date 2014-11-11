'use strict';

/**
 * update_rename_noindex.js
 *
 * Executes the update_rename.js workload after dropping all non-_id indexes on
 * the collection.
 */
load('jstests/parallel/fsm_libs/extend_workload.js'); // for extendWorkload
load('jstests/parallel/fsm_workloads/update_rename.js'); // for $config
load('jstests/parallel/fsm_workload_modifiers/drop_all_indexes.js'); // for dropAllIndexes

var $config = extendWorkload($config, dropAllIndexes);
