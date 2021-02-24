const db = require("../models");
const _ = require("underscore");
const lodash = require("lodash");

const User = db.user;
const File = db.file;

exports.entryLocations = (req, res) => {
  let data = [];
  let promises = [];

  User.findById(req.body.id)
    .then((user) => {
      user.files.forEach((fileId) => {
        promises.push(
          File.findById(fileId)
            .then((file) => {
              if (file) {
                file.entries.forEach((entry) => {
                  if (
                    entry.response.headers &&
                    entry.response.headers.some(
                      (header) =>
                        header.name === "content-type" &&
                        header.value.split(";")[0] === "text/html"
                    ) &&
                    entry.location
                  ) {
                    data.push(entry.location);
                  }
                });
              }
            })
            .catch((err) => {
              return res.status(500).send({ message: err });
            })
        );
      });
    })
    .then(() => {
      Promise.allSettled(promises).then(() => {
        let locations = data;
        let uniqueLocations = lodash.uniqWith(locations, lodash.isEqual);

        for (let i = 0; i < uniqueLocations.length; i++) {
          let frequency = 0;

          for (let j = 0; j < locations.length; j++) {
            if (_.isEqual(uniqueLocations[i], locations[j])) {
              frequency = frequency + 1;
            }
          }
          uniqueLocations[i].freq = frequency;
        }

        res.status(200).send(uniqueLocations);
      });
    })
    .catch((err) => {
      return res.status(500).send({ message: err });
    });
};
