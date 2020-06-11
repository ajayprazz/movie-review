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
const movieRoute = require("./controllers/movie")();
const reviewRoute = require("./controllers/review")();

//middlewares
const authenticate = require("./middlewares/authenticate");

app.use("/auth", authRoute);
app.use("/movie", authenticate, movieRoute);
app.use("/review", authenticate, reviewRoute);

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