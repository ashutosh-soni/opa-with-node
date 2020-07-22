const db = require("../db/db");

exports.insertDataToDb = async (docObj) => {
  try {
    dbResponse = await db.getDB().withTransaction(async (tx) => {
      return await tx.opa_data.save(docObj);
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

exports.getDataFromDb = async (criteria) => {
  try {
    dbResponse = await db.getDB().withTransaction(async (tx) => {
      return await tx.opa_data.find(criteria);
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
