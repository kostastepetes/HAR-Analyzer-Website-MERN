// Import `authJwt` from `/middlewares/index.js`:
const { authJwt } = require("../middlewares");
// Import `user.controller` from `user.controller.js` as 'controller':
const controller = require("../controllers/user.controller");

// Export the following function:
module.exports = function (app) {
  // Use middleware to set a custom response header:
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  /* When a GET request is made to `/api/test/all`, respond by
  executing the `allAccess` function from `user.controller`: */
  app.get("/api/test/all", controller.allAccess);

  /* When a GET request is made to `/api/test/user`, respond by
  executing the `verifyToken` function from `authJwt` and
  the `userBoard` function from `user.controller`: */
  app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);

  /* When a GET request is made to `/api/test/admin`, respond by
  executing `verifyToken` and `isAdmin` functions from `authJwt` and
  the `adminBoard` function from `user.controller`: */
  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );
};

// We will import the function on `server.js`.
