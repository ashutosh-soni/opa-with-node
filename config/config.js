const path = require("path");
const colors = require("colors");

const prodConfig = require("./prod/prod-config");
const testConfig = require("./testing/test-config");
const devConfig = require("./dev/dev-config");
const commonConfig = require("./common-config");

let _config = { ...commonConfig };

exports.initConfig = () => {
  // if no NODE_ENV specify then default is : dev
  const NODE_ENV = process.env.NODE_ENV || "local";
  // console.log("node env", process.env.NODE_ENV);
  // console.log("activated env", NODE_ENV);
  const DB_URI = process.env.DB_URI;
  switch (NODE_ENV) {
    case "production":
      _config = {
        ..._config,
        ...prodConfig,
      };
      break;
    case "testing":
      _config = {
        ..._config,
        ...testConfig,
      };
      break;
    case "dev": {
      _config = {
        ..._config,
        ...devConfig,
      };
      break;
    }
    default:
      const localConfig = require("./local-config");
      _config = {
        ..._config,
        ...localConfig,
      };
  }

  // Remove envVars key to make _config object pretty
  // NOTE: the purpose envVars is just to keep track what is coming from from environment variables.
  delete _config["envVars"];

  console.log(`config init for env: ${_config.activeEnv}`.blue.bold);
  // console.log(_config);
  return _config;
};

exports.getConfig = () => {
  return _config;
};
