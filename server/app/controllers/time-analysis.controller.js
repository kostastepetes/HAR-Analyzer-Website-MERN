const db = require("../models");
const _ = require("underscore");
const lodash = require("lodash");

const User = db.user;
const File = db.file;

function getAvgTimingsByHours(arr) {
  let total = [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
    ],
    count = [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
    ];

  for (let i = 0; i < arr.length; i++) {
    if (!lodash.isUndefined(arr[i].timings)) {
      total[arr[i].hours] += arr[i].timings;
    } else {
      total[arr[i].hours] += 0;
    }

    count[arr[i].hours] += 1;
  }

  return {
    timings: total.map((n, i) => {
      if (count[i] !== 0) {
        return n / count[i];
      } else {
        return 0;
      }
    }),
  };
}

function getAvgTimingsByProperty(unmappedData, property) {
  let arr = unmappedData.map((entry) => {
    return {
      timings: entry.timings,
      hours: entry.hours,
      [property]: entry[property],
    };
  });

  let unique = [...new Set(arr.map((item) => item[property]))].map((item) => {
    return { [property]: item };
  });

  for (let i = 0; i < unique.length; i++) {
    let total = [
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
      ],
      count = [
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
      ];

    for (j = 0; j < arr.length; j++) {
      if (_.isEqual(unique[i][property], arr[j][property])) {
        if (!lodash.isUndefined(arr[j].timings)) {
          total[arr[j].hours] += arr[j].timings;
        } else {
          total[arr[j].hours] += 0;
        }

        count[arr[j].hours] += 1;
      }
    }

    unique[i].timings = total.map((n, i) => {
      if (count[i] !== 0) {
        return n / count[i];
      } else {
        return 0;
      }
    });
  }
  return unique;
}

exports.basicTimeAnalysisInfo = (req, res) => {
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

      let unmappedData = temp.map((entry) => {
        let myDate = new Date(entry.startedDateTime);
        let hours = myDate.getHours();
        let day = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(
          myDate
        );

        let contentType = "unknown";
        entry.response.headers.forEach((element) => {
          if (element.name === "content-type") {
            contentType = element.value.split(";")[0];
          }
        });

        return {
          timings: entry.timings && entry.timings.wait,
          hours: hours,
          contentType: contentType,
          day: day,
          method: entry.request.method,
          isp: entry.isp,
        };
      });

      let mappedForHours = unmappedData.map((entry) => {
        return {
          timings: entry.timings,
          hours: entry.hours,
        };
      });
      data.default = getAvgTimingsByHours(mappedForHours);

      data.byType = getAvgTimingsByProperty(unmappedData, "contentType");
      data.byDay = getAvgTimingsByProperty(unmappedData, "day");
      data.byMethod = getAvgTimingsByProperty(unmappedData, "method");
      data.byIsp = getAvgTimingsByProperty(unmappedData, "isp");

      return res.status(200).send(data);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send({ message: err });
    });
};
