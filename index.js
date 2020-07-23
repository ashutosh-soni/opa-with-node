const express = require("express");
const child_process = require("child_process");
const bodyParser = require("body-parser");
const db = require("./db/db");
const colors = require("colors");
const axios = require("axios");
const cors = require("cors");

const config = require("./config/config");

const dataRoutes = require("./routes/dataRoute");
const regoRoutes = require("./routes/regoRoute");
const policyCheckRoutes = require("./routes/policyCheckRoute");
const opaRoutes = require("./routes/opaRoute");
const { publishAll } = require("./controller/regoController");

const app = express();

// Enable CORS
app.use(cors());

const jsonParser = bodyParser.json();

const startOpaServer = async () => {
  const opaConfig = config.getConfig()["opaConfig"];
  try {
    const healthEndPoint = `${opaConfig["url"]}/health`;

    const response = await axios.get(healthEndPoint);
    if (response.status == 200) {
      console.log("OPA server is running healthy".green);
    }
    if (response.status == 500) {
      console.log("OPA server is running unhealthy".red);
    }
  } catch (e) {
    if (e["code"] == "ECONNREFUSED" || e["code"] == "ECONNRESET") {
      // start the service for the first time
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
    } else {
      console.log("connection to opa server is failed".red, e["code"]);
    }
  }
};

// Mount routers
app.use("/api/v1/data", jsonParser, dataRoutes);
app.use("/api/v1/rego", regoRoutes);
app.use("/api/v1/policies", jsonParser, policyCheckRoutes);
app.use("/opa", jsonParser, opaRoutes);

// health
app.get("/health", (req, res) => {
  process.nextTick(() => {
    res.send({
      success: true,
    });
  });
});

const loadPolicies = async () => {
  return await publishAll();
};

const boot = async () => {
  // Initialize config
  const configObj = config.initConfig();
  const port = configObj["PORT"];
  console.log("config", configObj);
  await startOpaServer();

  await db.initDb(configObj["dbSpec"]);

  app.listen(port, () => {
    console.log("App started at port:".green.bold, port);
  });
  await loadPolicies();
};

boot();

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  // server.close(() => process.exit(1));
});
