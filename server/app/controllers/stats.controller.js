const db = require("../models");

const User = db.user;
const File = db.file;

exports.userStats = (req, res) => {
  let data = [];
  let promises = [];

  User.findById(req.body.id)
    .then((user) => {
      user.files.forEach((fileId) => {
        promises.push(
          File.findById(fileId)
            .then((file) => {
              if (file) {
                data.push({
                  numberOfEntries: file.entries.length,
                  uploadedAt: file.uploadedAt,
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
        res.send(data);
      });
    })
    .catch((err) => {
      return res.status(500).send({ message: err });
    });
};
