const db = require("../models");
const _ = require("underscore");
const lodash = require("lodash");

const User = db.user;
const File = db.file;

exports.basicInfo = (req, res) => {
  let data = {};
  let promises = [];

  promises.push(
    User.countDocuments()
      .then((count) => {
        data.userCount = count;
      })
      .catch((err) => {
        return res.status(500).send({ message: err });
      })
  );

  promises.push(
    File.find({})
      .then((result) => {
        let entries = result
          .map((result) => {
            return result.entries;
          })
          .flat(1);

        let domainNames = entries.map((entry) => {
          return { url: entry.request.url };
        });

        let uniqueDomainNames = lodash.uniqWith(domainNames, lodash.isEqual);

        data.uniqueDomainNames = uniqueDomainNames.length;

        let isps = result.map((file) => {
          return { isp: file.isp };
        });

        let uniqueIsps = lodash.uniqWith(isps, lodash.isEqual);

        data.uniqueIsps = uniqueIsps.length;
      })
      .catch((err) => {
        return res.status(500).send({ message: err });
      })
  );

  Promise.allSettled(promises).then(() => {
    return res.status(200).send(data);
  });
};

exports.entriesByReqType = (req, res) => {
  File.find({})
    .then((result) => {
      let entries = result
        .map((result) => {
          return result.entries;
        })
        .flat(1);

      let requestTypes = entries.map((entry) => {
        return { method: entry.request.method };
      });

      let uniqueRequestTypes = lodash.uniqWith(requestTypes, lodash.isEqual);

      for (let i = 0; i < uniqueRequestTypes.length; i++) {
        let frequency = 0;

        for (let j = 0; j < requestTypes.length; j++) {
          if (_.isEqual(uniqueRequestTypes[i], requestTypes[j])) {
            frequency = frequency + 1;
          }
        }
        uniqueRequestTypes[i].freq = frequency;
      }

      return res.status(200).send(uniqueRequestTypes);
    })
    .catch((err) => {
      return res.status(500).send({ message: err });
    });
};

exports.entriesByResStatus = (req, res) => {
  File.find({})
    .then((result) => {
      let entries = result
        .map((result) => {
          return result.entries;
        })
        .flat(1);

      let responseStatus = entries.map((entry) => {
        return { status: entry.response.status };
      });

      let uniqueResponseStatus = lodash.uniqWith(
        responseStatus,
        lodash.isEqual
      );

      for (let i = 0; i < uniqueResponseStatus.length; i++) {
        let frequency = 0;

        for (let j = 0; j < responseStatus.length; j++) {
          if (_.isEqual(uniqueResponseStatus[i], responseStatus[j])) {
            frequency = frequency + 1;
          }
        }
        uniqueResponseStatus[i].freq = frequency;
      }

      return res.status(200).send(uniqueResponseStatus);
    })
    .catch((err) => {
      return res.status(500).send({ message: err });
    });
};

exports.entryAvgAgeByType = (req, res) => {
  File.find({})
    .then((result) => {
      let entries = result
        .map((result) => {
          return result.entries;
        })
        .flat(1)
        .filter(
          (entry) =>
            entry.startedDateTime &&
            entry.response.headers.some(
              (header) => header.name === "last-modified"
            )
        )
        .map((entry) => {
          return {
            startedDateTime: entry.startedDateTime,
            contentType:
              entry.response.headers.find(
                (header) => header && header.name === "content-type"
              ) &&
              entry.response.headers
                .find((header) => header && header.name === "content-type")
                .value.split(";")[0],
            lastModified:
              entry.response.headers.find(
                (header) => header && header.name === "last-modified"
              ) &&
              entry.response.headers.find(
                (header) => header && header.name === "last-modified"
              ).value,
          };
        })
        .map((entry) => {
          let sDT = new Date(entry.startedDateTime);
          let lM = new Date(entry.lastModified);
          let age = sDT - lM;

          return {
            contentType: entry.contentType,
            age: age,
          };
        });

      let uniqueContentTypes = [
        ...new Set(entries.map((entry) => entry.contentType)),
      ].map((item) => {
        return { contentType: item };
      });

      for (let i = 0; i < uniqueContentTypes.length; i++) {
        let frequency = 0;
        let total = 0;

        for (let j = 0; j < entries.length; j++) {
          if (uniqueContentTypes[i].contentType === entries[j].contentType) {
            frequency = frequency + 1;
            total = total + entries[j].age;
          }
        }
        uniqueContentTypes[i].averageAge = total / frequency;
      }

      return res.status(200).send(uniqueContentTypes);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send({ message: err });
    });
};
