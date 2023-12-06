const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitizer = require("express-mongo-sanitize");

const { port, DB } = require("./config");
const routes = require("./routes");

const app = express();
app.use(cors());

//defence
app.use(helmet());
app.use(mongoSanitizer());
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: "Too many requests, please try again in an hour.",
});

//config
app.use("/api", limiter);
app.use(express.json({ limit: "10kb" }));

//db connection
mongoose
    .connect(DB)
    .then(() => console.log("DB connection successfull."))
    .catch((err) => console.log("Failed to connect to DB!"));

app.use("/api/bg-explorer", routes);
app.use("*", (req, res) => {
    res.redirect("/404");
});

const server = app.listen(port, () => console.log(`App is running on port: ${port}...`));

process.on("unhandledRejection", (err) => {
    console.log(err.name, err.message);
    console.log(`UNHANDLER REJECTION! Shutting down...`);
    server.close(() => {
        process.exit(1);
    });
});
