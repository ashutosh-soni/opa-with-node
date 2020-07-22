const commonConfig = {
  //only for information and troubleshooting
  version: "1.0.0",
  isDev: false,

  // Collection of environment variable definitions. These override the configuration
  // obtained from the config files. The **key** represents the environemnt variable
  // name suffix and the value represents the index in the config map.
  envVars: {
    // Shows active enviroment like [prod, testing, dev]
    NODE_ENV: ["activeEnv"],
  },

  activeEnv: null,
  PORT: null,
  dbSpec: {
    host: "localhost",
    port: 5432,
    database: "zs_opa_dev",
    user: "postgres",
    password: "iamnothing19@",
    ssl: false,
    poolSize: 10,
  },
  opaConfig: {},
};

module.exports = commonConfig;
