const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitizer = require("express-mongo-sanitize");
const hpp = require("hpp");

const { port, DB } = require("./config");
const routes = require("./routes");

process.on("uncouthError", (err) => {
    console.log(`UNCAUGHT REJECTION! Shutting down...`);
    console.log(err.name, err.message);
    process.exit(1);
});

const app = express();

//defence
app.use(helmet());
app.use(mongoSanitizer());
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: "Too many requests, please try again in an hour.",
});
app.use(
    hpp({
        whitelist: [
            "duration",
            "ratingsQuantity",
            "ratingsAverage",
            "maxGroupSize",
            "difficulty",
            "price",
        ],
    })
);

//config
app.use("/api", limiter);
app.use(express.json({ limit: "10kb" }));
app.use(cors());

//db connection
mongoose
    .connect(DB)
    .then(() => console.log("DB connection successfull."))
    .catch((err) => console.log("Failed to connect to DB!"));

app.use("/api/bg-explorer", routes);
app.use("*", (req, res) => {
    res.redirect("/api/bg-explorer/404");
});

const server = app.listen(port, () => console.log(`App is running on port: ${port}...`));

process.on("unhandledRejection", (err) => {
    console.log(err.name, err.message);
    console.log(`UNHANDLER REJECTION! Shutting down...`);
    server.close(() => {
        process.exit(1);
    });
});
