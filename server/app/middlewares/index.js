// Import `authJwt` from `./authJwt.js`:
const authJwt = require("./authJwt");
// Import `verifyRegister` from `./verifyRegister`:
const verifyRegister = require("./verifyRegister");

// Export both modules under `/middlewares/index.js`:
module.exports = {
  authJwt,
  verifyRegister,
};

// To import, use `const {authJwt, verifyRegister} = require("./middlewares")`.
