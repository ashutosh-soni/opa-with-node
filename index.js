const express = require("express");
const bodyParser = require("body-parser");
const config = require("./config/config").config;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const boot = () => {
  console.log("config", config);
  const port = config["port"];
  app.listen(port, () => {
    console.log("App started at port:", port);
  });
};

boot();
