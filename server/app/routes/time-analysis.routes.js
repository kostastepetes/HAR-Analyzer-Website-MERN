const { authJwt } = require("../middlewares");
const controller = require("../controllers/time-analysis.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/api/test/admin/time-analysis",
    [authJwt.verifyToken],
    controller.basicTimeAnalysisInfo
  );
};
