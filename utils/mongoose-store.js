const session = require("express-session");
const Session = require("../schemas/sessionSchema");

class MongooseSessionStore extends session.Store {

    async get(sid, callback) {
        try {
            const doc = await Session.findById(sid);

            if (!doc) {
                return callback(null, null);
            }

            if (doc.expires && doc.expires < new Date()) {
                await Session.deleteOne({ _id: sid });
                return callback(null, null);
            }

            callback(null, JSON.parse(doc.session));
        } catch (err) {
            callback(err);
        }
    }

    async set(sid, sessionData, callback) {
        try {
            await Session.findOneAndUpdate(
                { _id: sid },
                {
                    _id: sid,
                    session: JSON.stringify(sessionData),
                    expires: sessionData.cookie?.expires
                        ? new Date(sessionData.cookie.expires)
                        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                },
                {
                    upsert: true,
                    new: true
                }
            );

            callback(null);
        } catch (err) {
            callback(err);
        }
    }

    async destroy(sid, callback) {
        try {
            await Session.deleteOne({ _id: sid });
            callback(null);
        } catch (err) {
            callback(err);
        }
    }

    async touch(sid, sessionData, callback) {
        try {
            await Session.updateOne(
                { _id: sid },
                {
                    expires: sessionData.cookie?.expires
                        ? new Date(sessionData.cookie.expires)
                        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                }
            );

            callback(null);
        } catch (err) {
            callback(err);
        }
    }
}

module.exports = MongooseSessionStore;