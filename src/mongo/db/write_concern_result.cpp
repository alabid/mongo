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

#include "mongo/db/write_concern_result.h"

namespace mongo {

    void WriteConcernResult::appendTo(const WriteConcernOptions& writeConcern,
                                      BSONObjBuilder* result) const {

        if (syncMillis >= 0)
            result->appendNumber("syncMillis", syncMillis);

        if (fsyncFiles >= 0)
            result->appendNumber("fsyncFiles", fsyncFiles);

        if (wTime >= 0) {
            if (wTimedOut)
                result->appendNumber("waited", wTime);
            else
                result->appendNumber("wtime", wTime);
        }

        if (wTimedOut)
            result->appendBool("wtimeout", true);

        if (writtenTo.size()) {
            BSONArrayBuilder hosts(result->subarrayStart("writtenTo"));
            for (size_t i = 0; i < writtenTo.size(); ++i) {
                hosts.append(writtenTo[i].toString());
            }
        }
        else {
            result->appendNull("writtenTo");
        }

        if (err.empty())
            result->appendNull("err");
        else
            result->append("err", err);

        // *** 2.4 SyncClusterConnection compatibility ***
        // 2.4 expects either fsync'd files, or a "waited" field exist after running an fsync : true
        // GLE, but with journaling we don't actually need to run the fsync (fsync command is
        // preferred in 2.6).  So we add a "waited" field if one doesn't exist.

        if (writeConcern.syncMode == WriteConcernOptions::FSYNC) {

            if (fsyncFiles < 0 && ( wTime < 0 || !wTimedOut )) {
                dassert(result->asTempObj()["waited"].eoo());
                result->appendNumber("waited", syncMillis);
            }

            dassert(result->asTempObj()["fsyncFiles"].numberInt() > 0 ||
                    !result->asTempObj()["waited"].eoo());
        }
    }

} // namespace mongo
