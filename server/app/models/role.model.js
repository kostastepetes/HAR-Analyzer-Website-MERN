const mongoose = require("mongoose");

// Create a `Role` model:
const Role = mongoose.model(
  "Role",
  // The model will be based on the following schema:
  new mongoose.Schema({
    name: String,
  })
);

// Export the model as `Role`:
module.exports = Role;
