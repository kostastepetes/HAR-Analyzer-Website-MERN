const jwt = require("jsonwebtoken");
// Import `/config/auth.config.js` as `config`:
const config = require("../config/auth.config.js");
// Import `/models/index.js` as `db`:
const db = require("../models");

// `const User = require("./user.model");`
const User = db.user;
// `const Role = require("./role.model");`
const Role = db.role;

// Function for token verification:
verifyToken = (req, res, next) => {
  // Store the content of the request's `x-access-token` header in `token`:
  let token = req.headers["x-access-token"];

  // If `token` is empty:
  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  // Verify the `token` using `config.secret`:
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    // Store the decoded id in the request's `userId`:
    req.userId = decoded.id;
    next();
  });
};

// Function for admin verification:
isAdmin = (req, res, next) => {
  // Find a user with `UserId` as their id and store their info in `user`:
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    // Find all roles that satisfy a condition and store their info in `roles`:
    Role.find(
      {
        // `_id` must be present in `roles` property of `user`:
        _id: { $in: user.roles },
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        // For each role in `roles`:
        for (let i = 0; i < roles.length; i++) {
          // If a role's name is "admin":
          if (roles[i].name === "admin") {
            next();
            return;
          }
        }

        res.status(403).send({ message: "Require admin role!" });
        return;
      }
    );
  });
};

// Object containing the functions:
const authJwt = {
  verifyToken,
  isAdmin,
};

// Exporting the object as `authJwt`:
module.exports = authJwt;

// We can now import `authJwt` and use these functions.
