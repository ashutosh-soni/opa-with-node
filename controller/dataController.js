const { insertDataToDb, getDataFromDb } = require("../model/dataModel");
const { sendResponse } = require("../utils/apiResponse.js");

exports.insert = async (req, res, next) => {
  const { name, type } = req.params;
  const docObj = { name, type, data: req.body };
  // console.log(docObj);
  const dbResponse = await insertDataToDb(docObj);
  sendResponse(res, dbResponse);
};

exports.getData = async (req, res, next) => {
  const { name, type } = req.params;
  const dbResponse = await getDataFromDb({ name, type });
  sendResponse(res, dbResponse);
};
