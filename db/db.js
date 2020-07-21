const { createDb, migrate } = require("postgres-migrations");
const massive = require("massive");
const colors = require("colors");

let _db;

exports.initDb = async (dbSpec) => {
  const host = dbSpec.host;
  const port = dbSpec.port;
  const databaseName = dbSpec.database;
  try {
    await createDb(databaseName, { ...dbSpec, defaultDatabase: "postgres" });
    await migrate(dbSpec, `${__dirname}/migration`);

    console.log(
      `Starting DB connection at ${host}:${port} with db: ${databaseName}`.cyan
    );
    _db = await massive(dbSpec);
    console.log(`DB is connected successfully!`.cyan.bold);
    return _db;
  } catch (err) {
    console.log(
      `DB connection is failed. Application is terminating!`.red.bold
    );
    console.log(`Error: ${err.message}`.red);
    process.exit(1);
  }
};

exports.getDB = () => {
  return _db;
};
