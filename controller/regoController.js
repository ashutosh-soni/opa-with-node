const axios = require("axios");

const { insertRegoToDb, getRegoFromDb } = require("../model/regoModal");
const { sendResponse } = require("../utils/apiResponse.js");

exports.insert = async (req, res, next) => {
  const { name, type } = req.params;
  const docObj = { name, type, rego: req.body };
  // console.log("Request body", req.body);
  // console.log(docObj);
  const dbResponse = await insertRegoToDb(docObj);
  res.setHeader("content-type", "text/plain");
  res.send(dbResponse);
  // sendResponse(res, req.body);
  // sendResponse(res, dbResponse);
};

exports.getData = async (req, res, next) => {
  const { name, type } = req.params;
  const dbResponse = await getRegoFromDb({ name, type });
  const normalizedResponse = dbResponse["data"][0]["rego"];
  res.setHeader("content-type", "text/plain");
  res.send(normalizedResponse);
  // sendResponse(res, dbResponse);
};

exports.publishAll = async (req, res, next) => {
  const { name, type } = req.params;
  const dbResponse = await getRegoFromDb({ name, type });
  const normalizedResponse = dbResponse["data"][0]["rego"];
  var config = {
    headers: {
      "Content-Type": "text/plain",
    },
    responseType: "text",
  };

  const response = axios.put(
    "http://localhost:8181/v1/policies/zscontent",
    normalizedResponse,
    config
  );

  res.send(response);
  // sendResponse(res, dbResponse);
};
