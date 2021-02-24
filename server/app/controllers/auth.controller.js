// Import `/config/auth.config.js` as `config`:
const config = require("../config/auth.config");
// Import `/models/index.js` as `db`:
const db = require("../models");

// `const User = require("./user.model");`
const User = db.user;

// `const Role = require("./role.model");`
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

// Export function `register()`:
exports.register = (req, res) => {
  // Create a `user` with the response's body properties as attributes:
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    // Hash password before storing:
    password: bcrypt.hashSync(req.body.password, 8),
  });

  // Attempt to save the `user` in the database:
  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    // If there are roles specified in the request's body:
    if (req.body.roles) {
      // Find all roles that satisfy a condition and store their info in `roles`:
      Role.find(
        {
          // `name` must be present in the request's body:
          name: { $in: req.body.roles },
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          // Map `roles` and store the new array of role `_id`s in `user.roles`:
          user.roles = roles.map((role) => role._id);

          // Save the `user` in database:
          user.save((err) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            res.send({ message: "User was registered successfully!" });
          });
        }
      );
    }
    // If there are roles specified in the request's body:
    else {
      // Find a `role` with the name "user" and store their info in `role`:
      Role.findOne({ name: "user" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        // Store the `_id` of `role` in `user.roles`:
        user.roles = [role._id];

        // Save the `user` in database:
        user.save((err) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          res.send({ message: "User was registered successfully!" });
        });
      });
    }
  });
};

// Export function login:
exports.login = (req, res) => {
  // Find a user whose `username` is the same as the `username` of the request's body and store their info in `user`:
  User.findOne({
    username: req.body.username,
  })
    // Populate the `roles` of `user` but only return the `-__v` attribute :
    .populate("roles", "-__v")
    // Execute the query and store the result in `user`:
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      // If `user` is empty:
      if (!user) {
        return res.status(404).send({ message: "User not found." });
      }

      // Function that compares the `password` of the request's body with `user.password`:
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      // If `passwordIsValid` is false:
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid password!",
        });
      }

      // Create and sign a JSON Web Token:
      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400, // 24 hours
      });

      var authorities = [];

      // For each role in `user.roles`:
      for (let i = 0; i < user.roles.length; i++) {
        // Push the appropriate string into the `authorities` array:
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }
      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        roles: authorities,
        accessToken: token,
      });
    });
};
