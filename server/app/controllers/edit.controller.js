// Import `/models/index.js` as `db`:
const db = require("../models");

// `const User = require("./user.model");`
const User = db.user;

var bcrypt = require("bcryptjs");

// Export function `editUsername`:
exports.editUsername = (req, res) => {
  // Find a user whose `username` is the same as the `username` of the request's body and store their info in `user`:
  User.findOne({
    username: req.body.username,
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    // If `user` is not empty:
    if (user) {
      return res
        .status(404)
        .send({ message: "Failed! Username is already in use!" });
    }

    // Update their `username` according to the request's body:
    User.updateOne(
      {
        _id: req.body.id,
      },
      {
        $set: { username: req.body.username },
      }
    ).exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      return res.send({ message: "Your username has been updated!" });
    });
  });
};

// Export function `editPassword`:
exports.editPassword = (req, res) => {
  // Update their `password` according to the request's body:
  User.updateOne(
    {
      _id: req.body.id,
    },
    {
      $set: { password: bcrypt.hashSync(req.body.password, 8) },
    }
  ).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    return res.send({ message: "Your password has been updated!" });
  });
};
