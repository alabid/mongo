// comands_with_write_concern.h

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

#pragma once

#include "mongo/db/commands.h"
#include "mongo/db/write_concern.h"

namespace mongo {

    /**
     * Base class for commands that take in a write concern.
     * The CommandWithWriteConcern::run() is responsible for extracting the write concern
     * from the command arguments, running the command, and then waiting for the write concern
     * to be satisfied.
     */
    class CommandWithWriteConcern : public Command {
        MONGO_DISALLOW_COPYING(CommandWithWriteConcern);
    public:
        virtual ~CommandWithWriteConcern() {}

    protected:

        CommandWithWriteConcern(StringData _name,
                                bool web,
                                StringData oldName) :
            Command(_name, web, oldName) {
        }

        virtual bool run(
            OperationContext* txn,
            const std::string& dbname,
            BSONObj& cmdObj,
            int options,
            std::string& errmsg,
            BSONObjBuilder& result,
            const WriteConcernOptions& writeConcern,
            bool fromRepl) = 0;

    private:

        virtual bool slaveOk() const;

        virtual bool run(
            OperationContext* txn,
            const std::string& dbname,
            BSONObj& cmdObj,
            int options,
            std::string& errmsg,
            BSONObjBuilder& result,
            bool fromRepl);

    };

} // namespace mongo
