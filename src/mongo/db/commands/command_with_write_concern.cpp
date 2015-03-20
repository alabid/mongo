/**
 *    Copyright (C) 2015 MongoDB Inc.
 *
 *    This program is free software: you can redistribute it and/or  modify
 *    it under the terms of the GNU Affero General Public License, version 3,
 *    as published by the Free Software Foundation.
 *
 *    This program is distributed in the hope that it will be useful,
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *    GNU Affero General Public License for more details.
 *
 *    You should have received a copy of the GNU Affero General Public License
 *    along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 *    As a special exception, the copyright holders give permission to link the
 *    code of portions of this program with the OpenSSL library under certain
 *    conditions as described in each individual source file and distribute
 *    linked combinations including the program with the OpenSSL library. You
 *    must comply with the GNU Affero General Public License in all respects for
 *    all of the code used other than as permitted herein. If you modify file(s)
 *    with this exception, you may extend this exception to your version of the
 *    file(s), but you are not obligated to do so. If you do not wish to do so,
 *    delete this exception statement from your version. If you delete this
 *    exception statement from all source files in the program, then also delete
 *    it in the license file.
 */

#include "mongo/db/commands/command_with_write_concern.h"

#include "mongo/db/client.h"
#include "mongo/db/operation_context_impl.h"

namespace mongo {

    // Slaves can't perform writes.
    bool CommandWithWriteConcern::slaveOk() const { return false; }

    void CommandWithWriteConcern::ignoreWriteConcernWait() {
        _enforceWC = false;
    }

    bool CommandWithWriteConcern::run(OperationContext* txn,
                                      const std::string& dbname,
                                      BSONObj& cmdObj,
                                      int options,
                                      std::string& errmsg,
                                      BSONObjBuilder& result,
                                      bool fromRepl) {

        StatusWith<WriteConcernOptions> wcResult = extractWriteConcern(cmdObj);
        if (!wcResult.isOK()) {
            return appendCommandStatus(result, wcResult.getStatus());
        }

        bool ok = runWithWC(txn,
                            dbname,
                            cmdObj,
                            options,
                            errmsg,
                            result,
                            wcResult.getValue(),
                            fromRepl);

        if (ok && _enforceWC) {
            /* same as 'txn->getCurOp()->setMessage' */
            txn->setMessage("waiting for write concern");

            WriteConcernResult res;
            wcResult = waitForWriteConcern(txn,
                                           wcResult.getValue(),
                                           txn->getClient()->getLastOp(),
                                           &res);
            appendCommandWCStatus(result, wcResult.getStatus(), res);
        }
        _enforceWC = true;

        return ok;
    }

} // namespace mongo
