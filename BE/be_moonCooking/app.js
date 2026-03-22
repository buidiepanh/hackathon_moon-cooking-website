var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");

var indexRouter = require("./routes/index");
var authenRouter = require("./routes/authenRouter");
var userRouter = require("./routes/userRouter");
var stepRouter = require("./routes/stepRouter");
var receiptRouter = require("./routes/receiptRouter");
var restaurantRouter = require("./routes/restaurantRouter");
var fearRouter = require("./routes/featRouter");
const featRouter = require("./routes/featRouter");
var packageRouter = require("./routes/packageRouter");

var app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/api/v1/authen", authenRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/step", stepRouter);
app.use("/api/v1/receipt", receiptRouter);
app.use("/api/v1/restaurant", restaurantRouter);
app.use("/api/v1/feature", featRouter);
app.use("/api/v1/subscription", packageRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
