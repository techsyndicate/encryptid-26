const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
    _id: String,
    expires: Date,
    session: String
});

const Session = mongoose.model("Session", sessionSchema);

module.exports = Session;