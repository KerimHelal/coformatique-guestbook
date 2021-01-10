const Users = require("../models/users");

exports.getAllUsers = (req, res) => {
  Users.find({}).exec((err, users) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.status(200).send({
        users: users
      });
  })
};



