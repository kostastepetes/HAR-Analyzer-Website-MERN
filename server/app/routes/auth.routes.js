// Import `verifyRegister` from `/middlewares/index.js`:
const { verifyRegister } = require("../middlewares");
// Import `auth.controller` from `auth.controller.js` as 'controller':
const controller = require("../controllers/auth.controller");

// Export the following function as `auth.controller`:
module.exports = function (app) {
  // Use middleware to set a custom response header:
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  /* When a POST request is made to `/api/auth/register`, respond by
  executing the middleware functions from `verifyRegister` and the 
  `register` function from `auth.controller`: */
  app.post(
    "/api/auth/register",
    [
      verifyRegister.checkDuplicateUsernameOrEmail,
      verifyRegister.checkAbsentRoles,
    ],
    controller.register
  );

  /* When a POST request is made to `/api/auth/register`, respond by
  executing the `login` function from `auth.controller`: */
  app.post("/api/auth/login", controller.login);
};

// We will import the function on `server.js`.
