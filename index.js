const express = require("express");
const child_process = require("child_process");
const bodyParser = require("body-parser");
const db = require("./db/db");
const colors = require("colors");
const axios = require("axios");

const config = require("./config/config");

const dataRoutes = require("./routes/dataRoute");
const regoRoutes = require("./routes/regoRoute");
const policyCheckRoutes = require("./routes/policyCheckRoute");

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
app.use("/api/v1/policies", jsonParser, policyCheckRoutes);

const loadPolicies = () => {
  const response = axios.put(
    "http://localhost:3000/api/v1/rego/publishAll/zs-content/rbac"
  );
};

const boot = async () => {
  // Initialize config
  const configObj = config.initConfig();
  const port = configObj["PORT"];
  console.log("config", configObj);
  startOpaServer();

  await db.initDb(configObj["dbSpec"]);

  app.listen(port, () => {
    console.log("App started at port:".green.bold, port);
  });
  loadPolicies();
};

boot();
