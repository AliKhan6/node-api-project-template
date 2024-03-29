const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const config = require("./app/config/config.js");

const app = express();

// const corsOptions = {
//   origin: "http://localhost:8081"
// };

app.use(cors());

app.options("*", cors());


// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// database
const db = require("./app/models");
const Role = db.role;




////
//// ===== > Don't refresh but add new attributes
////

db.sequelize.sync(
  { alter: true }
).then(() => {
  // initial(); // Just use it in development, at the first time execution!. Delete it in production
}).catch((err) => {
  // print the error details 
  console.log(err);
});



////
//// ===== > Refresh database
////

// db.sequelize
//   .sync(
//     { force: true }
//   )
//   //  .sync() 
//   .then(() => {
//    
//   }).catch(err => {
//     console.log(`error:${err} `)
//   });




// simple route
app.get("/", (req, res) => {
  res.json({ message: "Hi there, welcome to this tutorial." });
});

// api routes
require("./app/routes/book.routes")(app);
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);

// set port, listen for requests
const PORT = config.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Just use it in development, at the first time execution!. Delete it in production
function initial() {
  Role.create({
    id: 1,
    name: "user"
  });

  Role.create({
    id: 2,
    name: "moderator"
  });

  Role.create({
    id: 3,
    name: "admin"
  });

  Role.create({
    id: 4,
    name: "super-admin"
  });
}
