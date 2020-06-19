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

//routing
const appRoute = require("./routes/");
app.use("/", appRoute);

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