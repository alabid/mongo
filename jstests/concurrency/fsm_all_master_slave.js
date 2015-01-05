'use strict';

load('jstests/concurrency/fsm_libs/runner.js');

var dir = 'jstests/concurrency/fsm_workloads';

var blacklist = [
    // Disabled due to known bugs

    // Disabled due to MongoDB restrictions and/or workload restrictions

    // These workloads sometimes trigger 'Could not lock auth data update lock'
    // errors because the AuthorizationManager currently waits for only five
    // seconds to acquire the lock for authorization documents
    'auth_create_role.js',
    'auth_create_user.js',
    'auth_drop_role.js',

    // These workloads are disabled because of recent changes in capped
    // collection behavior with wiredTiger (see: SERVER-16235)
    'create_capped_collection.js',
    'create_capped_collection_maxdocs.js',
].map(function(file) { return dir + '/' + file; });

// SERVER-16196 re-enable executing workloads with master-slave replication
// runWorkloadsSerially(ls(dir).filter(function(file) {
//     return !Array.contains(blacklist, file);
// }), { masterSlave: true });
