const mongoose = require('mongoose');

const userConversationSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userModel'
    },
    sender_id: {
        type: String,
    },
    sender_message: {
        type: String,
    },
    reciever_id: {
        type: String
    },
    reciever_message: {
        type: String
    },
    first_name: {
        type: String,
    },
    sender_email: {
        type: String
    },
    last_name: {
        type: String
    },
    profile_pic: {
        type: String
    },
    message_type : {
        type: String
    },
    status_type: {
        type: String
    }
});

const userConversation = mongoose.model('userConversationModel', userConversationSchema);

module.exports = {
    userConversation
};
