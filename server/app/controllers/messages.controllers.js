const Messages = require("../models/messages");

exports.getUserMessages = (req, res) => {
  Messages.find({ $or: [ { 'sender.id': req.params.id }, { 'receiver.id': req.params.id } ] }).exec((err, messages) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.status(200).send({ messages });
  })
};

exports.sendMessage = (req, res) => {
  const message = new Messages({
    sender: req.body.sender,
    receiver: req.body.receiver,
    content: req.body.content,
  });


  message.save((err, message) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    } else {
        res.send({ message: "Message was sent successfully!" });
    } 
  });
};

exports.deleteMessage = (req, res) => {
  Messages.deleteOne(req.messageId, (err) => {
    if (err) {
        res.status(500).send({ message: err });
    } else {
      res.send({ message: "Message deleted successfuly" });
    }
  });
};

exports.updateMessage = (req, res) => {
  Messages.update({ _id: req.body.messageId }, { $set: { content: req.body.message} }, (err) => {
    if (err) {
      res.status(500).send({ message: err });
    } else {
      res.send({ message: "Message updated successfuly" });
    }
  });
};

