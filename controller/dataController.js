const _ = require("lodash");

const asyncHandler = require("../middleware/async");
const {
  insertDataToDb,
  getDataFromDb,
  updateDataToDb,
} = require("../model/dataModel");
const {
  sendResponse,
  validationError,
  ErrorResponse,
} = require("../utils/apiResponse.js");

exports.insert = asyncHandler(async (req, res, next) => {
  const { name, type } = req.params;

  const docObj = { name, type, data: req.body };
  const dbCheck = await getDataFromDb({ name, type });
  console.log(dbCheck);
  if (dbCheck.isSuccess) {
    if (_.isEmpty(dbCheck.data)) {
      const dbResponse = await insertDataToDb(docObj);
      sendResponse(res, dbResponse);
    } else {
      ErrorResponse(res, `data for combination ${name} and ${type} exist.`);
    }
  } else {
    console.log("Error: ".red, dbCheck.err);
    ErrorResponse(res, `Internal Server error`);
  }
});

exports.update = asyncHandler(async (req, res, next) => {
  const { name, type, id } = req.params;

  const docObj = { id, name, type, data: req.body };
  const dbCheck = await getDataFromDb({ name, type, id });
  console.log(dbCheck);
  if (dbCheck.isSuccess) {
    if (_.isEmpty(dbCheck.data)) {
      ErrorResponse(
        res,
        `data for combination ${name}, ${type} and id: ${id} does not exist.`
      );
    } else {
      const dbResponse = await updateDataToDb(docObj);
      sendResponse(res, dbResponse);
    }
  } else {
    console.log("Error: ".red, dbCheck.err);
    ErrorResponse(res, `Internal Server Error`);
  }
});

exports.getData = asyncHandler(async (req, res, next) => {
  const { name, type } = req.params;
  const dbResponse = await getDataFromDb({ name, type });
  sendResponse(res, dbResponse);
});
