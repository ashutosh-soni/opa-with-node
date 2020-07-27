const axios = require("axios");
const _ = require("lodash");

const asyncHandler = require("../middleware/async");
const {
  insertRegoToDb,
  getRegoFromDb,
  updateRegoToDb,
} = require("../model/regoModal");
const { sendResponse, ErrorResponse } = require("../utils/apiResponse.js");
const config = require("../config/config");

exports.insert = asyncHandler(async (req, res, next) => {
  const { name, type } = req.params;
  const docObj = { name, type, rego: req.body };
  const dbCheck = await getRegoFromDb({ name, type });

  if (dbCheck.isSuccess) {
    if (_.isEmpty(dbCheck.data)) {
      const dbResponse = await insertRegoToDb(docObj);
      sendResponse(res, dbResponse);
    } else {
      ErrorResponse(
        res,
        `Rego for combination ${name} and ${type} already exist.`
      );
    }
  } else {
    console.log("Error: ".red, dbCheck.err);
    ErrorResponse(res, `Internal Server error`);
  }
});

const updateRegoToOpa = async (regoDoc) => {
    const opaConfig = config.getConfig()["opaConfig"];
  console.log("Testing updateRegoToOpa", opaConfig);
  const {name, type, rego} = regoDoc;
  const path = `${opaConfig["url"]}/v1/policies/${name}/${type}`;
  const configAxios = {
    headers: {
      "Content-Type": "text/plain",
    },
    responseType: "text",
  };
  const response = await axios.put(path, rego, configAxios);
  if (response.status == 200) {
    console.log(`Policy loaded for ${path}`.green);
    return {isSuccess: true };
  } else {
    console.log(`Policy not loaded for ${path} with ${response.data}`.red);
    return {isSuccess: false, err: response.data };
  }
} 

exports.update = asyncHandler(async (req, res, next) => {
  const { name, type, id } = req.params;
  const docObj = { id, name, type, rego: req.body };
  const dbCheck = await getRegoFromDb({ name, type, id });
  console.log(dbCheck);

  if (dbCheck.isSuccess) {
    if (_.isEmpty(dbCheck.data)) {
      ErrorResponse(
        res,
        `Rego for combination ${name} and ${type} for id: ${id} does not exist.`
      );
    } else {
      const dbResponse = await updateRegoToDb(docObj);
      const { isSuccess, data } = dbResponse;
      if(isSuccess){
        opaResponse = await updateRegoToOpa(data);
        if (opaResponse.isSuccess){
          sendResponse(res, dbResponse);
        }else{
          sendResponse(res, opaResponse.err);
        }
      }
    }
  } else {
    console.log("Error: ".red, dbCheck.err);
    ErrorResponse(res, `Internal Server error`);
  }
});

exports.getRego = asyncHandler(async (req, res, next) => {
  const { name, type } = req.params;
  const dbResponse = await getRegoFromDb({ name, type });
  sendResponse(res, dbResponse);
});

exports.getRegoById = asyncHandler(async (req, res, next) => {
  const { name, type, id } = req.params;
  const dbResponse = await getRegoFromDb({ name, type, id });
  const normalizedResponse = _.get(dbResponse, ["data", 0, "rego"], null);
  res.setHeader("content-type", "text/plain");
  res.send(normalizedResponse);
});



exports.publishAll = async () => {
  const opaConfig = config.getConfig()["opaConfig"];
  const dbResponse = await getRegoFromDb({});
  const regoList = _.get(dbResponse, ["data"], null);

  if (_.isEmpty(regoList)) {
    console.log("No rego is there in db".red);
  } else {
    regoList.forEach(async (doc, index) => {
      const path = `${opaConfig["url"]}/v1/policies/${_.get(doc, [
        "name",
      ])}/${_.get(doc, ["type"])}`;
      const rego = _.get(doc, ["rego"]);
      const configAxios = {
        headers: {
          "Content-Type": "text/plain",
        },
        responseType: "text",
      };

      const response = await axios.put(path, rego, configAxios);
      if (response.status == 200) {
        console.log(`Policy loaded for ${path}`.green);
      } else {
        console.log(`Policy not loaded for ${path}`.red);
      }
    });
  }
  return 0;
};
