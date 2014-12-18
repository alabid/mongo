'use strict';

/**
 * indexed_insert_base_capped.js
 *
 * Executes the indexed_insert_base.js workload on a capped collection.
 */
load('jstests/parallel/fsm_libs/extend_workload.js'); // for extendWorkload
load('jstests/parallel/fsm_workloads/indexed_insert_base.js'); // for $config
load('jstests/parallel/fsm_workload_modifiers/make_capped.js'); // for makeCapped

var $config = extendWorkload($config, makeCapped);
