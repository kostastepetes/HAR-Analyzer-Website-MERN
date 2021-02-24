// Import `/models/index.js` as `db`:
const db = require("../models");
// `const ROLES = ["user", "admin"]`:
const ROLES = db.ROLES;
// `const User = require("./user.model");`
const User = db.user;

// Function that checks if username/email is already used:
checkDuplicateUsernameOrEmail = (req, res, next) => {
  // Find a user with the same `username` and store their info in `user`:
  User.findOne({
    username: req.body.username,
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (user) {
      res.status(400).send({ message: "Failed! Username is already in use!" });
      return;
    }

    // Find a user with the same `email` and store their info in `user`:
    User.findOne({
      email: req.body.email,
    }).exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (user) {
        res.status(400).send({ message: "Failed! Email is already in use!" });
        return;
      }

      next();
    });
  });
};

// Function that cheks if the role(s) specified in the request's body is valid:
checkAbsentRoles = (req, res, next) => {
  // Check for any roles in the request's body:
  if (req.body.roles) {
    // For each role in the request's body:
    for (let i = 0; i < req.body.roles.length; i++) {
      // If the role is not "user" or "admin":
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: `Failed! Role ${req.body.roles[i]} does not exist!`,
        });
        return;
      }
    }
  }

  next();
};

// Object containing the functions:
const verifyRegister = {
  checkDuplicateUsernameOrEmail,
  checkAbsentRoles,
};

// Exporting the object as `verifyRegister`:
module.exports = verifyRegister;

// We can now import `verifyRegister` and use these functions.
