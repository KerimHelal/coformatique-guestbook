const messagesControllers = require("../controllers/messages.controllers");

module.exports = app => {
  app.get('/messages/getAll/:id', messagesControllers.getUserMessages);
  app.post('/messages/delete', messagesControllers.deleteMessage);
  app.put('/messages/update', messagesControllers.updateMessage);
  app.post('/messages/send', messagesControllers.sendMessage);

};
