"use strict";
const express = require("express");
const app = express();

require("dotenv").config()

const cors = require("cors")

const fs = require("fs");

const sslkey = fs.readFileSync("ssl-key.pem");
const sslcert = fs.readFileSync("ssl-cert.pem")

const options = {
      key: sslkey,
      cert: sslcert
};


const catRouter = require("./routes/catRouter");


const userRouter = require("./routes/userRouter");

const recipeRouter = require("./routes/recipeRouter");
const commentRouter = require("./routes/commentRouter");
const pictureRouter = require("./routes/pictureRouter");
const ingredientRouter = require("./routes/ingredientRouter");

const passport = require("./utils/pass.js");

const authRoute = require("./routes/authRoute.js");

console.log(`Starting local port: ${process.env.HTTP_PORT} https port: ${process.env.HTTPS_PORT} port: ${process.env.PORT}`)

app.use(express.json())
app.use(express.urlencoded())
app.use(cors())
app.use(passport.initialize())
app.enable("trust proxy");
app.use("/auth", authRoute);

process.env.NODE_ENV = process.env.NODE_ENV || "development";
if (process.env.NODE_ENV === "production") {
    console.log("Node env prod")
    require("./utils/production")(app, process.env.PORT, process.env.HTTP_PORT, options);
    app.listen(process.env.HTTP_PORT);
} else {
    console.log("Node env localhost")
    require("./utils/localhost")(app, process.env.HTTPS_PORT, process.env.HTTP_PORT, options);
}

app.get("/", (req, res) => {
  res.send("Hello Secure World!");
});





app.use((err, req, res, next) => {
    console.log("Error!")
    const status = err.status || 500;
    res.status(status).json({ message: err.message || "internal error" });
});



app.use("/recipe", passport.authenticate("jwt", {session: false}, recipeRouter));
app.use("/comment", passport.authenticate("jwt", {session: false}, commentRouter));
app.use("/picture", passport.authenticate("jwt", {session: false}, pictureRouter));
app.use("/ingredient", passport.authenticate("jwt", {session: false}, ingredientRouter));
app.use("/user", passport.authenticate("jwt", {session: false}), userRouter);
app.use("/thumbnails", express.static("thumbnails"));

