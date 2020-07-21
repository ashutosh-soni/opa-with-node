const { insertRegoToDb, getRegoFromDb } = require("../model/regoModal");
const { sendResponse } = require("../utils/apiResponse.js");

exports.insert = async (req, res, next) => {
  const docObj = req.body;
  console.log("Request body", req.body);
  const dbResponse = await insertRegoToDb(docObj);
  sendResponse(res, dbResponse);
};

exports.getData = async (req, res, next) => {
  const dbResponse = await getRegoFromDb();
  sendResponse(res, dbResponse);
};
