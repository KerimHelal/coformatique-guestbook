const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Replies = new Schema({
    messageId: {
        type: String
    },
    sender: {
        type: {
            name: String,
            id: String
        }
    },
    content: {
        type: String
    }
}, { collection: 'replies' });

module.exports = mongoose.model('Replies', Replies);