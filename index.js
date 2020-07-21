const express = require("express");
const child_process = require("child_process");
const bodyParser = require("body-parser");
const db = require("./db/db");
const colors = require("colors");
const axios = require("axios");

const config = require("./config/config").config;

const dataRoutes = require("./routes/dataRoute");
const regoRoutes = require("./routes/regoRoute");

const app = express();

const jsonParser = bodyParser.json();

const startOpaServer = () => {
  var workerProcess = child_process.spawn("./opa", ["run", "--server"]);

  workerProcess.stdout.on("data", function (data) {
    console.log("[LOG][stdout:][OPA]: ".brightMagenta + data);
  });

  workerProcess.stderr.on("data", function (data) {
    console.log("[LOG][stderr:][OPA]: ".brightMagenta + data);
  });

  workerProcess.on("close", function (code) {
    console.log("child process exited with code :".brightMagenta + code);
  });
};

// Mount routers
app.use("/api/v1/data", jsonParser, dataRoutes);
app.use("/api/v1/rego", regoRoutes);

const testCall = () => {
  var config = {
    headers: {
      "Content-Length": 0,
      "Content-Type": "text/plain",
    },
    responseType: "text",
  };

  axios
    .put("http://localhost:8181/v1/policies/zscontent", "", config)
    .then(function (response) {
      console.log("saved successfully at rego");
    })
    .catch(function (error) {
      console.log(error);
    });
};

const boot = async () => {
  console.log("config", config);

  const port = config["port"];

  startOpaServer();

  await db.initDb(config["dbSpec"]);

  app.listen(port, () => {
    console.log("App started at port:".green.bold, port);
  });
  //   testCall();
};

boot();
