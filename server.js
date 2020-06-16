const express = require("express");
const bodyparser = require("body-parser");
const morgan = require("morgan");

require("./config/db");
const config = require("./config/index");

const app = express();

app.use(morgan("dev"));

app.use(bodyparser.json());
app.use(
  bodyparser.urlencoded({
    extended: false,
  })
);


//routes
const authRoute = require("./controllers/auth")();
const userRoute = require("./controllers/user")();
const movieRoute = require("./controllers/movie")();
const reviewRoute = require("./controllers/review")();
const genreRoute = require("./controllers/genre")();

//middlewares
const authenticate = require("./middlewares/authenticate");

app.use("/auth", authRoute);
app.use("/user", authenticate, userRoute);
app.use("/movie", authenticate, movieRoute);
app.use("/review", authenticate, reviewRoute);
app.use("/genre", authenticate, genreRoute);

app.use((err, req, res, next) => {
  res.status(err.status || 400).json({
    status: err.status || 400,
    message: err
  });
});

app.listen(config.app.port, (err, done) => {
  if (err) throw err;
  console.log("server listening at 4040");
});