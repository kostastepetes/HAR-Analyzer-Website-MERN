const { authJwt } = require("../middlewares");
const controller = require("../controllers/stats.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/test/user/stats", [authJwt.verifyToken], controller.userStats);
};
