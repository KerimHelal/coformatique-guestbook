const config = require("../config/auth.config");
const Users = require("../models/users");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.register = (req, res) => {
  const user = new Users({
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    name: req.body.name
  });


  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    } else {
        res.send({ message: "Registered successfuly !" });
    } 
  });
};

exports.login = (req, res) => {
  Users.findOne({
    email: req.body.email
  }).exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "Wrong Email or Password." });
      }

      var validPassword = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!validPassword) {
        return res.status(401).send({
          accessToken: null,
          message: "Wrong Password!"
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400
      });


      res.status(200).send({
        id: user._id,
        email: user.email,
        name: user.name,
        accessToken: token
      });
    });
};
