const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const cors = require("cors");
const app = express();
const customerRouter = require("./routes/customerRoutes");
const restaurantRouter = require("./routes/restaurantRoutes");
const itemRouter = require("./routes/itemRoutes");
const orderRouter = require("./routes/orderRoutes");

//Middleware
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
const limiter = rateLimit({
  max: 10000,
  windowMs: 60 * 60 * 1000,
  message: "Too many request from this IP, please try again in an hour!",
});
app.use("/", limiter);

app.use(express.json());
app.use(mongoSanitize());
app.use(xss());

app.use("/customer", customerRouter);
app.use("/restaurant", restaurantRouter);
app.use("/item", itemRouter);
app.use("/order", orderRouter);

app.all("*", (req, res, next) =>
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
);

app.use(globalErrorHandler);
module.exports = app;
