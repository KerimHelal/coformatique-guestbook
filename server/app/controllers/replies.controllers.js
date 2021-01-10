const Replies = require("../models/replies");

exports.getMessageReplies = (req, res) => {
  Replies.find({ messageId: req.params.id }).exec((err, replies) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.status(200).send({ replies });
  })
};

exports.sendReply = (req, res) => {
    const reply = new Replies({
      messageId: req.body.messageId,
      sender: req.body.sender,
      content: req.body.content,
    });
  
    reply.save((err, reply) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      } else {
          res.send({ message: "Reply was sent successfully!" });
      } 
    });
  };


