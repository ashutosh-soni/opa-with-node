const { insertDataToDb, getDataFromDb } = require("../model/dataModel");
const { sendResponse } = require("../utils/apiResponse.js");

exports.insert = async (req, res, next) => {
  const docObj = req.body;
  // console.log("Request body", req.body);
  const dbResponse = await insertDataToDb(docObj);
  sendResponse(res, dbResponse);
};

exports.getData = async (req, res, next) => {
  const dbResponse = await getDataFromDb();
  sendResponse(res, dbResponse);
};
