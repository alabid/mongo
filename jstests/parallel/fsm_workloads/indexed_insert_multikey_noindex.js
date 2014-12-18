'use strict';

/**
 * indexed_insert_multikey_noindex.js
 *
 * Executes the indexed_insert_multikey.js workload after dropping its index.
 */
load('jstests/parallel/fsm_libs/extend_workload.js'); // for extendWorkload
load('jstests/parallel/fsm_workloads/indexed_insert_multikey.js'); // for $config
load('jstests/parallel/fsm_workload_modifiers/indexed_noindex.js'); // for indexedNoindex

var $config = extendWorkload($config, indexedNoindex);
