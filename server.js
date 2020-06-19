const express = require("express");
const bodyparser = require("body-parser");
const morgan = require("morgan");

// require("./config/db");
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
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const movieRoute = require("./routes/movie");
const reviewRoute = require("./routes/review");
const genreRoute = require("./routes/genre");

app.use("/auth", authRoute);
app.use("/user", userRoute);
app.use("/movie", movieRoute);
app.use("/review", reviewRoute);
app.use("/genre", genreRoute);

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