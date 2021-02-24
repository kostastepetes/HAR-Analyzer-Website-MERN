const mongoose = require("mongoose");

// Create a `User` model:
const User = mongoose.model(
  "User",
  // The model will be based on the following schema:
  new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    // `roles` is an arry of object ids. Each id references a `Role`:
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
      },
    ],
    // `files` is an array of object ids. Each id references a `File`:
    files: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "File",
      },
    ],
  })
);

// Export the model as `User`:
module.exports = User;
