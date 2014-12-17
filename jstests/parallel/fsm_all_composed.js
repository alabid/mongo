'use strict';

load('jstests/parallel/fsm_libs/runner.js');

var dir = 'jstests/parallel/fsm_workloads';

var blacklist = [
    // Disabled due to known bugs

    // Disabled due to MongoDB restrictions and/or workload restrictions

    // These workloads sometimes trigger 'Could not lock auth data update lock'
    // errors because the AuthorizationManager currently waits for only five
    // seconds to acquire the lock for authorization documents
    'auth_create_role.js',
    'auth_create_user.js',

    // These workloads are disabled because of recent changes in capped
    // collection behavior with wiredTiger (see: SERVER-16235)
    'create_capped_collection.js',
    'create_capped_collection_maxdocs.js',

    // These workloads take too long when composed because eval takes a
    // global lock and the composer doesn't honor iteration counts:
    'remove_single_document_eval.js',
    'update_simple_eval.js',

    // These workloads take too long when composed because server-side JS
    // is slow and the composer doesn't honor iteration counts:
    'remove_single_document_eval_nolock.js',
    'update_simple_eval_nolock.js',
].map(function(file) { return dir + '/' + file; });

// SERVER-16196 re-enable executing workloads
// runCompositionOfWorkloads(ls(dir).filter(function(file) {
//     return !Array.contains(blacklist, file);
// }));
