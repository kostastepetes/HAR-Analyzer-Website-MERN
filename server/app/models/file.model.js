const mongoose = require("mongoose");

// Create a `File` model:
const File = mongoose.model(
  "File",
  // The model will be based on the following schema:
  new mongoose.Schema({
    uploadedAt: { type: Date, default: Date.now },
    isp: String,
    location: {},
    entries: { type: Array },
  })
);

// Export the model as `File`:
module.exports = File;
