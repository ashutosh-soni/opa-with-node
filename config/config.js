const config = {
  port: 3000,
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

module.exports = { config };
