const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const app = express();

app.use(cors());

//config
require("dotenv").config();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
const routes = require("./routes");

const PORT = process.env.PORT;
//db connection
mongoose
    .connect(process.env.DB)
    .then(() => console.log("DB connection successfull."))
    .catch((err) => console.log("Failed to connect to DB!"));

app.use("/api/bg-explorer", routes);
app.use("*", (req, res) => {
    res.redirect("/404");
});

const server = app.listen(PORT, () => console.log(`App is running on port: ${PORT}...`));

process.on("unhandledRejection", (err) => {
    console.log(err.name, err.message);
    console.log(`UNHANDLER REJECTION! Shutting down...`);
    server.close(() => {
        process.exit(1);
    });
});
