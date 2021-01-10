const repliesControllers = require("../controllers/replies.controllers");

module.exports = app => {
  app.get('/replies/getReplies/:id', repliesControllers.getMessageReplies);
  app.post('/replies/send', repliesControllers.sendReply);
};
