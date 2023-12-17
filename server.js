// load .env data into process.env
require("dotenv").config();

// Web server config
const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
const morgan = require("morgan");
const session = require("express-session");

const PORT = process.env.PORT || 8080;
const app = express();

app.set("trust proxy", 1);
app.use(
  session({
    name: "session",
    secret: "labber",
    //resave: false,
    // saveUninitialized: true,
    //cookie: { secure: true },
  })
);

app.set("view engine", "ejs");

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(
  "/styles",
  sassMiddleware({
    source: __dirname + "/styles",
    destination: __dirname + "/public/styles",
    isSass: false, // false => scss, true => sass
  })
);
app.use(express.static("public"));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const userApiRoutes = require("./routes/users-api");
const widgetApiRoutes = require("./routes/widgets-api");
const usersRoutes = require("./routes/users");

const loginRouter = require("./routes/login-router.js");
const registerRouter = require("./routes/register-router.js");
const newListingRouter = require("./routes/newListing-router.js");
const mainPageRouter = require("./routes/mainPage-router.js");
const listingsRouter = require("./routes/listings-router.js");
const logoutRouter = require("./routes/logout-router.js"); // Changes made here
const sellerRouter = require("./routes/seller-router.js"); // Changes made here

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
// Note: Endpoints that return data (eg. JSON) usually start with `/api`
app.use("/api/users", userApiRoutes);
app.use("/api/widgets", widgetApiRoutes);
app.use("/users", usersRoutes);
// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).
app.use(loginRouter);
app.use(registerRouter);
app.use(newListingRouter);
app.use(mainPageRouter);
app.use(logoutRouter); //Changes made here
app.use(sellerRouter); //Changes made here
app.use(listingsRouter);



/*app.get('/', (req, res) => {
  res.render('index');
});*/

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
