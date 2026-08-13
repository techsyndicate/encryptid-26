const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const reqString = { type: String, required: true };
const nonReqString = { type: String, required: false };

const challengeSchema = new Schema({
    title: reqString,
    description: reqString,
    type: reqString,
    points: {
        type: Number,
        required: true
    },
    answer: reqString,
    attachmentName: {
        type: String,
        required: true,
        default: 'none'
    },
    attachmentLink: {
        type: String,
        required: true,
        default: 'none'
    },
    img: {
        type: String,
        required: true,
        default: 'none'
    },
    challengeId: reqString,
    solves: {
        type: Number,
        required: true,
        default: 0
    },
    solvers: {
        type: Array,
        required: true,
        default: []
    }
})

module.exports = mongoose.model("Challenge", challengeSchema)