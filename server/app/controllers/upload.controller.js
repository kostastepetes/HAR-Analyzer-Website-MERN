const axios = require("axios");

// Import `/models/index.js` as `db`:
const db = require("../models");

// `const User = require("./user.model");`
const User = db.user;
// `const File = require("./file.model");`
const File = db.file;

// Export function `uploadFile`:
exports.uploadFile = (req, res) => {
  const ip = req.header("x-forwarded-for") || req.connection.remoteAddress;

  let promises = [];
  let entries = req.body.entries;

  for (let i = 0; i < entries.length; i++) {
    promises.push(
      axios
        .get(
          `https://get.geojs.io/v1/ip/geo/${entries[i].serverIPAddress}.json`
        )
        .then((r) => {
          entries[i].location = {
            lat: parseFloat(r.data.latitude),
            lng: parseFloat(r.data.longitude),
          };
        })
        .catch((e) => {
          console.log(`Empty serverIPAdress field detected!`);
        })
    );
  }

  Promise.allSettled(promises)
    .then(() => {
      axios
        .get(`https://get.geojs.io/v1/ip/geo/${ip}.json`)
        .then((resp) => {
          // Create a file with the respone's body `entries` as attributes:
          const file = new File({
            isp: resp.data.organization,
            entries: entries,
          });

          if (!isNaN(resp.data.latitude) && !isNaN(resp.data.longitude)) {
            file.location = {
              lat: parseFloat(resp.data.latitude),
              lng: parseFloat(resp.data.longitude),
            };
          }

          // Save `file` in database:
          file.save((err, file) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            // Then, find a user whose `_id` is same as the response's body `id`:
            User.findOne(
              {
                _id: req.body.id,
              },
              (err, user) => {
                if (err) {
                  res.status(500).send({ message: err });

                  return;
                }

                // Then, store the `_id` of the uploaded `file` in `user.files`:
                user.files.push(file._id);

                // Save changes made to `user`:
                user.save((err) => {
                  if (err) {
                    res.status(500).send({ message: err });

                    return;
                  }

                  res.send({ message: "File was uploaded successfully!" });
                });
              }
            );
          });
        })
        .catch((erro) => {
          console.log(`${erro.message}`);
        });
    })
    .catch((e) => {
      console.log(`${e.message}`);
    });
};
