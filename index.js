const express = require("express");
const child_process = require("child_process");
const bodyParser = require("body-parser");
const colors = require("colors");

const config = require("./config/config").config;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

const boot = () => {
  console.log("config", config);
  const port = config["port"];
  startOpaServer();
  app.listen(port, () => {
    console.log("App started at port:".green.bold, port);
  });
};

boot();
