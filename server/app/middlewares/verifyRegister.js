const Users = require('../models/users');

exports.checkIfEmailExists = (req, res, next) => {
  Users.findOne({
    email: req.body.email
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (user) {
      res.status(400).send({ message: "An account with this email is already registerd." });
      return;
    }
    next();
  });
};


