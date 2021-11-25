var express = require("express");
var logger = require("morgan");
var cookieSession = require("cookie-session");

var pizzaRouter = require("./routes/pizzas");
var authsRouter = require("./routes/auths");

var app = express();

let expiryDate = new Date(Date.now() + 60 * 60 * 1000); // 1h;
app.use(
  cookieSession({
    name: "user",
    keys: ["689HiHoveryDi79*"],
    cookie: {
      httpOnly: true,
      expires: expiryDate,
    },
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/pizzas", pizzaRouter);
app.use("/auths", authsRouter);

module.exports = app;
