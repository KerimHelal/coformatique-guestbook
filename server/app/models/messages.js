const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Messages = new Schema({
    sender: {
        type: {
            name: String,
            id: String
        }
    },
    receiver: {
        type: {
            name: String,
            id: String
        }
    },
    content: {
        type: String
    }
}, { collection: 'messages' });

module.exports = mongoose.model('Messages', Messages);