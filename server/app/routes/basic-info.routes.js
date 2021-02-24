const { authJwt } = require("../middlewares");
const controller = require("../controllers/basic-info.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/api/test/admin/basic-info",
    [authJwt.verifyToken],
    controller.basicInfo
  );

  app.get(
    "/api/test/admin/basic-info/by-type",
    [authJwt.verifyToken],
    controller.entriesByReqType
  );

  app.get(
    "/api/test/admin/basic-info/by-status",
    [authJwt.verifyToken],
    controller.entriesByResStatus
  );

  app.get(
    "/api/test/admin/basic-info/average-age",
    [authJwt.verifyToken],
    controller.entryAvgAgeByType
  );
};
