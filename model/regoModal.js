const db = require("../db/db");

exports.insertRegoToDb = async (docObj) => {
  try {
    dbResponse = await db.getDB().withTransaction(async (tx) => {
      return await tx.opa_rego.insert({ rego: docObj });
    });
    return { isSuccess: true, data: dbResponse };
  } catch (e) {
    return {
      isSuccess: false,
      err: {
        err: `failed to db write in postgres`,
        extraInfo: e.message,
      },
    };
  }
};

exports.getRegoFromDb = async (docObj) => {
  try {
    dbResponse = await db.getDB().withTransaction(async (tx) => {
      return await tx.opa_rego.find();
    });
    return { isSuccess: true, data: dbResponse };
  } catch (e) {
    return {
      isSuccess: false,
      err: {
        err: `failed to fetch from DB`,
        extraInfo: e.message,
      },
    };
  }
};
