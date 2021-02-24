const db = require("../models");
const _ = require("underscore");
const lodash = require("lodash");

const User = db.user;
const File = db.file;

exports.timeToLive = (req, res) => {
  let data = { a: {}, aByIsp: {} };

  File.find({})
    .then((result) => {
      // temp = all entries w/ file isp
      let temp = result
        .map((result) => {
          let myEntries = result.entries;
          myEntries.forEach((element) => {
            element.isp = result.isp;
          });
          return myEntries;
        })
        .flat(1);

      // ungroupedData = all non-null ttls
      let ungroupedData = temp
        .map((entry) => {
          let contentType = "unknown";
          entry.response.headers &&
            entry.response.headers.length > 0 &&
            entry.response.headers.forEach((element) => {
              if (element.name === "content-type") {
                contentType = element.value.split(";")[0];
              }
            });

          let maxAge = null;
          entry.response.headers &&
            entry.response.headers.length > 0 &&
            entry.response.headers.forEach((header) => {
              if (header.name === "cache-control") {
                if (header.value.includes("max-age")) {
                  maxAge = header.value
                    .split(",")
                    .filter((directive) => directive.includes("max-age"))[0]
                    .split("=")[1];
                }
              }
            });

          let expires = null,
            lastModified = null;
          entry.response.headers &&
            entry.response.headers.length > 0 &&
            entry.response.headers.forEach((header) => {
              if (
                header.name === "expires" &&
                header.value !== "-1" &&
                header.value !== "0"
              ) {
                expires = new Date(header.value);
              } else if (header.name === "last-modified") {
                lastModified = new Date(header.value);
              }
            });

          let ttl = null;
          if (maxAge) {
            ttl = maxAge;
          } else {
            if (expires && lastModified && !(expires - lastModified < 0)) {
              ttl = expires - lastModified;
            }
          }

          return {
            contentType: contentType,
            isp: entry.isp,
            ttl: ttl,
          };
        })
        .filter((entry) => entry.ttl !== null);

      // ================================================= //
      // a. //

      ungroupedDataTtl = ungroupedData.map((item) => {
        return parseInt(item.ttl);
      });

      let minTTL = Math.min.apply(Math, ungroupedDataTtl);
      let maxTTL = Math.max.apply(Math, ungroupedDataTtl);
      let diff = maxTTL - minTTL;
      let step = (maxTTL - minTTL) / 10;
      ungroupedData.forEach((entry) => {
        if (entry.ttl <= diff / 10) entry.bucket = 1;
        else if (entry.ttl > diff / 10 && entry.ttl <= (2 * diff) / 10)
          entry.bucket = 2;
        else if (entry.ttl > (2 * diff) / 10 && entry.ttl <= (3 * diff) / 10)
          entry.bucket = 3;
        else if (entry.ttl > (3 * diff) / 10 && entry.ttl <= (4 * diff) / 10)
          entry.bucket = 4;
        else if (entry.ttl > (4 * diff) / 10 && entry.ttl <= (5 * diff) / 10)
          entry.bucket = 5;
        else if (entry.ttl > (5 * diff) / 10 && entry.ttl <= (6 * diff) / 10)
          entry.bucket = 6;
        else if (entry.ttl > (6 * diff) / 10 && entry.ttl <= (7 * diff) / 10)
          entry.bucket = 7;
        else if (entry.ttl > (7 * diff) / 10 && entry.ttl <= (8 * diff) / 10)
          entry.bucket = 8;
        else if (entry.ttl > (8 * diff) / 10 && entry.ttl <= (9 * diff) / 10)
          entry.bucket = 9;
        else if (entry.ttl > (9 * diff) / 10 && entry.ttl <= (10 * diff) / 10)
          entry.bucket = 10;
      });

      let uniqueTypes = [
        ...new Set(ungroupedData.map((item) => item.contentType)),
      ].map((item) => {
        return { contentType: item };
      });

      for (let i = 0; i < uniqueTypes.length; i++) {
        uniqueTypes[i].buckets = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (let j = 0; j < ungroupedData.length; j++) {
          if (ungroupedData[j].contentType === uniqueTypes[i].contentType) {
            uniqueTypes[i].buckets[ungroupedData[j].bucket - 1] +=
              ungroupedData[j].bucket;
          }
        }
      }

      data.a.step = step;
      data.a.data = uniqueTypes;
      // ================================================= //
      // a. by isp //
      let uniqueIsp = [...new Set(ungroupedData.map((item) => item.isp))].map(
        (item) => {
          return { isp: item, data: [] };
        }
      );

      for (let j = 0; j < uniqueIsp.length; j++) {
        for (let k = 0; k < ungroupedData.length; k++) {
          if (ungroupedData[k].isp === uniqueIsp[j].isp) {
            uniqueIsp[j].data.push(ungroupedData[k]);
          }
        }
      }

      let uniqueTypes2 = [
        ...new Set(ungroupedData.map((item) => item.contentType)),
      ].map((item) => {
        return { contentType: item };
      });

      for (let l = 0; l < uniqueIsp.length; l++) {
        let minTTL = Math.min.apply(
          Math,
          uniqueIsp[l].data.map((item) => {
            return parseInt(item.ttl);
          })
        );
        let maxTTL = Math.max.apply(
          Math,
          uniqueIsp[l].data.map((item) => {
            return parseInt(item.ttl);
          })
        );
        let diff2 = maxTTL - minTTL;
        let step2 = (maxTTL - minTTL) / 10;

        uniqueIsp[l].data.forEach((entry) => {
          if (entry.ttl <= diff2 / 10) entry.bucket = 1;
          else if (entry.ttl > diff2 / 10 && entry.ttl <= (2 * diff2) / 10)
            entry.bucket = 2;
          else if (
            entry.ttl > (2 * diff2) / 10 &&
            entry.ttl <= (3 * diff2) / 10
          )
            entry.bucket = 3;
          else if (
            entry.ttl > (3 * diff2) / 10 &&
            entry.ttl <= (4 * diff2) / 10
          )
            entry.bucket = 4;
          else if (
            entry.ttl > (4 * diff2) / 10 &&
            entry.ttl <= (5 * diff2) / 10
          )
            entry.bucket = 5;
          else if (
            entry.ttl > (5 * diff2) / 10 &&
            entry.ttl <= (6 * diff2) / 10
          )
            entry.bucket = 6;
          else if (
            entry.ttl > (6 * diff2) / 10 &&
            entry.ttl <= (7 * diff2) / 10
          )
            entry.bucket = 7;
          else if (
            entry.ttl > (7 * diff2) / 10 &&
            entry.ttl <= (8 * diff2) / 10
          )
            entry.bucket = 8;
          else if (
            entry.ttl > (8 * diff2) / 10 &&
            entry.ttl <= (9 * diff2) / 10
          )
            entry.bucket = 9;
          else if (
            entry.ttl > (9 * diff2) / 10 &&
            entry.ttl <= (10 * diff2) / 10
          )
            entry.bucket = 10;
        });

        for (let m = 0; m < uniqueTypes2.length; m++) {
          uniqueTypes2[m].buckets = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
          for (let n = 0; n < uniqueIsp[l].data.length; n++) {
            if (
              uniqueIsp[l].data[n].contentType === uniqueTypes2[m].contentType
            ) {
              uniqueTypes2[m].buckets[uniqueIsp[l].data[n].bucket - 1] +=
                uniqueIsp[l].data[n].bucket;
            }
          }
        }

        uniqueIsp[l].readyData = uniqueTypes2;
        uniqueIsp[l].step = step2;
        uniqueTypes2 = [
          ...new Set(ungroupedData.map((item) => item.contentType)),
        ].map((item) => {
          return { contentType: item };
        });
      }

      uniqueIsp = uniqueIsp.map((item) => {
        return { step: item.step, isp: item.isp, data: item.readyData };
      });
      data.aByIsp = uniqueIsp;
      // ================================================= //
      // res.status(200).send(ungroupedDataTtl);

      res.status(200).send(data);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send({ message: err });
    });
};

exports.minMaxDirectivePercentages = (req, res) => {
  let data = {};

  File.find({})
    .then((result) => {
      let temp = result
        .map((result) => {
          let myEntries = result.entries;
          myEntries.forEach((element) => {
            element.isp = result.isp;
          });
          return myEntries;
        })
        .flat(1);

      let ungroupedData = temp.map((entry) => {
        let contentType = "unknown";
        entry.request.headers.length !== 0 &&
          entry.request.headers.forEach((element) => {
            if (element.name === "content-type") {
              contentType = element.value.split(";")[0];
            }
          });

        let hasMinFresh = false,
          hasMaxStale = false;
        entry.request.headers.length !== 0 &&
          entry.request.headers.forEach((element) => {
            if (element.name === "cache-control") {
              if (element.value.includes("min-fresh")) hasMinFresh = true;
              else if (element.value.includes("max-stale")) hasMaxStale = true;
            }
          });

        return {
          contentType: contentType,
          minFresh: hasMinFresh,
          maxStale: hasMaxStale,
          isp: entry.isp,
        };
      });

      // ================================================= //
      // b. //

      let uniqueTypes = [
        ...new Set(ungroupedData.map((item) => item.contentType)),
      ].map((item) => {
        return { contentType: item };
      });

      for (let i = 0; i < uniqueTypes.length; i++) {
        let minFreshPer =
          ungroupedData.filter(
            (item) =>
              item.contentType === uniqueTypes[i].contentType &&
              item.minFresh === true
          ).length / ungroupedData.length;

        let maxStalePer =
          ungroupedData.filter(
            (item) =>
              item.contentType === uniqueTypes[i].contentType &&
              item.maxStale === true
          ).length / ungroupedData.length;

        uniqueTypes[i].percentages = [minFreshPer * 100, maxStalePer * 100];
      }

      data.b = uniqueTypes;
      // ================================================= //
      // b. by isp //

      let uniqueIsp = [...new Set(ungroupedData.map((item) => item.isp))].map(
        (item) => {
          return { isp: item, data: [] };
        }
      );

      for (let j = 0; j < uniqueIsp.length; j++) {
        for (let k = 0; k < ungroupedData.length; k++) {
          if (ungroupedData[k].isp === uniqueIsp[j].isp) {
            uniqueIsp[j].data.push(ungroupedData[k]);
          }
        }
      }

      let uniqueTypes2 = [
        ...new Set(ungroupedData.map((item) => item.contentType)),
      ].map((item) => {
        return { contentType: item };
      });

      for (let l = 0; l < uniqueIsp.length; l++) {
        for (let m = 0; m < uniqueTypes2.length; m++) {
          let minFreshPer =
            uniqueIsp[l].data.filter(
              (item) =>
                item.contentType === uniqueTypes2[m].contentType &&
                item.minFresh === true
            ).length / uniqueIsp[l].data.length;

          let maxStalePer =
            uniqueIsp[l].data.filter(
              (item) =>
                item.contentType === uniqueTypes2[m].contentType &&
                item.maxStale === true
            ).length / uniqueIsp[l].data.length;

          uniqueTypes2[m].percentages = [minFreshPer * 100, maxStalePer * 100];
        }
        uniqueIsp[l].readyData = uniqueTypes2;
        uniqueTypes2 = [
          ...new Set(ungroupedData.map((item) => item.contentType)),
        ].map((item) => {
          return { contentType: item };
        });
      }

      uniqueIsp = uniqueIsp.map((item) => {
        return { isp: item.isp, data: item.readyData };
      });
      data.bByIsp = uniqueIsp;
      // ================================================= //

      return res.status(200).send(data);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send({ message: err });
    });
};

exports.cacheabilityDirectivePercentages = (req, res) => {
  let data = {};

  File.find({})
    .then((result) => {
      let temp = result
        .map((result) => {
          let myEntries = result.entries;
          myEntries.forEach((element) => {
            element.isp = result.isp;
          });
          return myEntries;
        })
        .flat(1);

      let ungroupedData = temp.map((entry) => {
        let contentType = "unknown";
        entry.response.headers.forEach((element) => {
          if (element.name === "content-type") {
            contentType = element.value.split(";")[0];
          }
        });

        let hasPublic = false,
          hasPrivate = false,
          hasNoCache = false,
          hasNoStore = false;
        entry.response.headers.forEach((element) => {
          if (element.name === "cache-control") {
            if (element.value.includes("public")) hasPublic = true;
            else if (element.value.includes("private")) hasPrivate = true;
            else if (element.value.includes("no-cache")) hasNoCache = true;
            else if (element.value.includes("no-store")) hasNoStore = true;
          }
        });

        return {
          contentType: contentType,
          public: hasPublic,
          private: hasPrivate,
          noCache: hasNoCache,
          noStore: hasNoStore,
          isp: entry.isp,
        };
      });

      // ================================================= //
      // c. //

      let uniqueTypes = [
        ...new Set(ungroupedData.map((item) => item.contentType)),
      ].map((item) => {
        return { contentType: item };
      });

      for (let i = 0; i < uniqueTypes.length; i++) {
        let publicPer =
          ungroupedData.filter(
            (item) =>
              item.contentType === uniqueTypes[i].contentType &&
              item.public === true
          ).length / ungroupedData.length;

        let privatePer =
          ungroupedData.filter(
            (item) =>
              item.contentType === uniqueTypes[i].contentType &&
              item.private === true
          ).length / ungroupedData.length;

        let noCachePer =
          ungroupedData.filter(
            (item) =>
              item.contentType === uniqueTypes[i].contentType &&
              item.noCache === true
          ).length / ungroupedData.length;

        let noStorePer =
          ungroupedData.filter(
            (item) =>
              item.contentType === uniqueTypes[i].contentType &&
              item.noStore === true
          ).length / ungroupedData.length;

        uniqueTypes[i].percentages = [
          publicPer * 100,
          privatePer * 100,
          noCachePer * 100,
          noStorePer * 100,
        ];
      }

      data.c = uniqueTypes;
      // ================================================= //
      // c. by isp //

      let uniqueIsp = [...new Set(ungroupedData.map((item) => item.isp))].map(
        (item) => {
          return { isp: item, data: [] };
        }
      );

      for (let j = 0; j < uniqueIsp.length; j++) {
        for (let k = 0; k < ungroupedData.length; k++) {
          if (ungroupedData[k].isp === uniqueIsp[j].isp) {
            uniqueIsp[j].data.push(ungroupedData[k]);
          }
        }
      }

      let uniqueTypes2 = [
        ...new Set(ungroupedData.map((item) => item.contentType)),
      ].map((item) => {
        return { contentType: item };
      });

      for (let l = 0; l < uniqueIsp.length; l++) {
        for (let m = 0; m < uniqueTypes2.length; m++) {
          let publicPer =
            uniqueIsp[l].data.filter(
              (item) =>
                item.contentType === uniqueTypes2[m].contentType &&
                item.public === true
            ).length / uniqueIsp[l].data.length;

          let privatePer =
            uniqueIsp[l].data.filter(
              (item) =>
                item.contentType === uniqueTypes2[m].contentType &&
                item.private === true
            ).length / uniqueIsp[l].data.length;

          let noCachePer =
            uniqueIsp[l].data.filter(
              (item) =>
                item.contentType === uniqueTypes2[m].contentType &&
                item.noCache === true
            ).length / uniqueIsp[l].data.length;

          let noStorePer =
            uniqueIsp[l].data.filter(
              (item) =>
                item.contentType === uniqueTypes2[m].contentType &&
                item.noStore === true
            ).length / uniqueIsp[l].data.length;

          uniqueTypes2[m].percentages = [
            publicPer * 100,
            privatePer * 100,
            noCachePer * 100,
            noStorePer * 100,
          ];
        }
        uniqueIsp[l].readyData = uniqueTypes2;
        uniqueTypes2 = [
          ...new Set(ungroupedData.map((item) => item.contentType)),
        ].map((item) => {
          return { contentType: item };
        });
      }

      uniqueIsp = uniqueIsp.map((item) => {
        return { isp: item.isp, data: item.readyData };
      });
      data.cByIsp = uniqueIsp;
      // ================================================= //

      return res.status(200).send(data);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send({ message: err });
    });
};
