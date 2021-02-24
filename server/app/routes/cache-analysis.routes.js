const { authJwt } = require("../middlewares");
const controller = require("../controllers/cache-analysis.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/api/test/admin/cache-analysis/time-to-live",
    [authJwt.verifyToken],
    controller.timeToLive
  );

  app.get(
    "/api/test/admin/cache-analysis/max-stale-min-fresh-directive-percentages",
    [authJwt.verifyToken],
    controller.minMaxDirectivePercentages
  );

  app.get(
    "/api/test/admin/cache-analysis/cacheability-directive-percentages",
    [authJwt.verifyToken],
    controller.cacheabilityDirectivePercentages
  );
};
