const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "http://localhost:3000",
};

// Enable CORS (Cross-Origin Resource Sharing) for "http://localhost:3000":
app.use(cors(corsOptions));

// Import `db` from `/models/index.js`:
const db = require("./app/models");
const Role = db.role;

const dbConfig = require("./app/config/db.config");

// Connect to MongoDB:
db.mongoose
  //.connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
  .connect(
    // "mongodb+srv://Christos:Christos123@cluster0.s2iqf.mongodb.net/http-app?retryWrites=true&w=majority",
    `mongodb+srv://${dbConfig.UN}:${dbConfig.PW}@cluster0.tr1d5.mongodb.net/${dbConfig.DB}?retryWrites=true&w=majority`,
    {
      // Avoid deprecation warnings:
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Successfully connected to MongoDB!");
    initial();
  })
  .catch((err) => {
    console.error("Connection error!", err);
    process.exit();
  });

// The following function populates the `roles` collection:
const initial = () => {
  // Calculate the document count of `roles` collection:
  Role.estimatedDocumentCount((err, count) => {
    // If the `roles` collection is empty:
    if (!err && count === 0) {
      // Create a `user` based on the `Role` model:
      new Role({
        name: "user",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log('Added "user" to roles collection!');
      });

      // Create an `admin` based on the `Role` model:
      new Role({
        name: "admin",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log('Added "admin" to roles collection!');
      });
    }
  });
};

// Parse requests of `Content-Type: application/json`:
app.use(bodyParser.json({ limit: "50mb" }));

// Parse requests of `Content-Type - application/x-www-form-urlencoded`:
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// // Simple route:
// app.get("/", (req, res) => {
//   res.json({ message: "Welcome to my app." });
// });

// Import the `auth.routes` function from `auth.routes.js`:
require("./app/routes/auth.routes")(app);
// Import the `user.routes` function from `user.routes.js`:
require("./app/routes/user.routes")(app);

// Import the `edit.routes` function from `edit.routes.js`:
require("./app/routes/edit.routes")(app);
// Import the `edit.routes` function from `edit.routes.js`:
require("./app/routes/upload.routes")(app);

// Import the `stats.routes` function from `stats.routes.js`:
require("./app/routes/stats.routes")(app);
// Import the `visualization.routes` function from `visualization.routes.js`:
require("./app/routes/visualization.routes")(app);

require("./app/routes/basic-info.routes")(app);
require("./app/routes/time-analysis.routes")(app);
require("./app/routes/cache-analysis.routes")(app);
require("./app/routes/admin-visualization.routes")(app);

// Set port:
const PORT = process.env.PORT || 5000;
// Listen for requests:
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
