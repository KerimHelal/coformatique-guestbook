const usersController = require("../controllers/users.controller");

module.exports = app => {
  app.get('/users/getAll', usersController.getAllUsers);
};
