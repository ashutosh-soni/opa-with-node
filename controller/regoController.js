const axios = require("axios");
const _ = require("lodash");

const { insertRegoToDb, getRegoFromDb } = require("../model/regoModal");
const { sendResponse } = require("../utils/apiResponse.js");
const config = require("../config/config");

exports.insert = async (req, res, next) => {
  const { name, type } = req.params;
  const docObj = { name, type, rego: req.body };
  // console.log("Request body", req.body);
  // console.log(docObj);
  const dbResponse = await insertRegoToDb(docObj);
  sendResponse(res, dbResponse);
};

exports.getData = async (req, res, next) => {
  const { name, type } = req.params;
  const dbResponse = await getRegoFromDb({ name, type });
  const normalizedResponse = dbResponse["data"][0]["rego"];
  res.setHeader("content-type", "text/plain");
  res.send(normalizedResponse);
  // sendResponse(res, dbResponse);
};

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
      const config = {
        headers: {
          "Content-Type": "text/plain",
        },
        responseType: "text",
      };

      const response = await axios.put(path, rego, config);
      if (response.status == 200) {
        console.log(`Policy loaded for ${path}`.green);
      } else {
        console.log(`Policy loaded for ${path}`.red);
      }
    });
  }
  return 0;
};
