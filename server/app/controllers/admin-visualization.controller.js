const db = require("../models");
const _ = require("underscore");
const lodash = require("lodash");

const User = db.user;
const File = db.file;

exports.adminVisualization = (req, res) => {
  let data = {};

  File.find({})
    .then((result) => {
      let origins = result
        .filter((result) => result.location)
        .map((result) => {
          return { lat: result.location.lat, lon: result.location.lng };
        });
      let uniqueOrigins = lodash.uniqWith(origins, lodash.isEqual);
      let i = 1;
      uniqueOrigins.forEach((origin) => {
        origin.id = i;
        i++;
      });

      let destinations = result
        .filter((result) => result.location)
        .map((result) => {
          return result.entries.map((entry) => {
            return entry.location;
          });
        })
        .flat(1)
        .filter((destination) => !!destination)
        .map((destination) => {
          return { lat: destination.lat, lon: destination.lng };
        });

      let uniqueDestinations = lodash.uniqWith(destinations, lodash.isEqual);
      for (let j = 0; j < uniqueDestinations.length; j++) {
        uniqueDestinations[j].id = i + j;
      }

      let uniqueLocations = uniqueOrigins.concat(uniqueDestinations);
      data.locations = uniqueLocations;
      // ============================================================

      let temp = result
        .map((result) => {
          return {
            startLoc: result.location,
            entries: result.entries.map((entry) => {
              return entry.location;
            }),
          };
        })
        .filter((item) => item.startLoc);

      temp.forEach((item) => {
        item.startLoc = { lat: item.startLoc.lat, lon: item.startLoc.lng };
        item.entries = item.entries
          .filter((entry) => !!entry)
          .map((entry) => {
            return { lat: entry.lat, lon: entry.lng };
          })
          .map((entry) => {
            return { startLoc: item.startLoc, endLoc: entry };
          });
      });

      let trips = temp
        .map((item) => {
          return item.entries;
        })
        .flat(1);

      for (let k = 0; k < trips.length; k++) {
        for (let l = 0; l < uniqueLocations.length; l++) {
          if (
            trips[k].startLoc.lat === uniqueLocations[l].lat &&
            trips[k].startLoc.lon === uniqueLocations[l].lon
          ) {
            trips[k].origin = uniqueLocations[l].id;
          }

          if (
            trips[k].endLoc.lat === uniqueLocations[l].lat &&
            trips[k].endLoc.lon === uniqueLocations[l].lon
          ) {
            trips[k].dest = uniqueLocations[l].id;
          }
        }
      }

      trips = trips.map((trip) => {
        return { origin: trip.origin, dest: trip.dest };
      });

      let uniqueTrips = lodash.uniqWith(trips, lodash.isEqual);

      for (let m = 0; m < uniqueTrips.length; m++) {
        let count = 0;

        for (let n = 0; n < trips.length; n++) {
          if (_.isEqual(uniqueTrips[m], trips[n])) {
            count = count + 1;
          }
        }
        uniqueTrips[m].count = count;
      }

      data.flows = uniqueTrips;

      res.status(200).send(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ message: err });
    });
};
