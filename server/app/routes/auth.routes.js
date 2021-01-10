const { verifyRegister } = require("../middlewares");
const authController = require("../controllers/auth.controller");

module.exports = app => {
  app.use(function(req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    );
    next();
  });
  app.use('/auth/register', verifyRegister.checkIfEmailExists);
  app.post('/auth/register', authController.register);
  app.post('/auth/login', authController.login);
};
