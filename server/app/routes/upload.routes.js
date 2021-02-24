// Import `authJwt` from `/middlewares/index.js`:
const { authJwt } = require("../middlewares");
// Import `edit.controller` from `edit.controller.js` as `controller`:
const controller = require("../controllers/upload.controller");

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

  /* When a POST request is made to `/api/test/user/upload`, 
  respond by executing the `verifyToken` function from `authJwt` and the
  `uploadFile` function from `upload.controller`:*/
  app.post(
    "/api/test/user/upload",
    [authJwt.verifyToken],
    controller.uploadFile
  );
};

// We will import the function on `server.js`.
