// Import `authJwt` from `/middlewares/index.js`:
const { authJwt } = require("../middlewares");
// Import `edit.controller` from `edit.controller.js` as `controller`:
const controller = require("../controllers/edit.controller");

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

  /* When a POST request is made to `/api/test/user/edit-username`, 
  respond by executing the `verifyToken` function from `authJwt` and the
  `editUsername` function from `edit.controller`:*/
  app.post(
    "/api/test/user/edit-username",
    [authJwt.verifyToken],
    controller.editUsername
  );

  /* When a POST request is made to `/api/test/user/edit-password`, 
  respond by executing the `verifyToken` function from `authJwt` and the
  `editPassword` function from `edit.controller`:*/
  app.post(
    "/api/test/user/edit-password",
    [authJwt.verifyToken],
    controller.editPassword
  );
};

// We will import the function on `server.js`.
