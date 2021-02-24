const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

// Define an empty `db` object:
const db = {};

// `db` has a `mongoose` property:
db.mongoose = mongoose;

// `db` has a `user` property:
db.user = require("./user.model");
// `db` has a `role` property:
db.role = require("./role.model");
// `db` has a `file` property:
db.file = require("./file.model");

// `db` has a `ROLES` property:
db.ROLES = ["user", "admin"];

// Export the `db` object as `db`:
module.exports = db;
