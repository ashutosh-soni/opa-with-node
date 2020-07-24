const _ = require("lodash");
const axios = require("axios");

const config = require("../config/config");
const { getDataFromDb } = require("../model/dataModel");
const { sendResponse } = require("../utils/apiResponse.js");
const asyncHandler = require("../middleware/async");

exports.check = asyncHandler(async (req, res, next) => {
  const { name, type } = req.params;
  const dbResponse = await getDataFromDb({ name, type });

  const external = _.get(dbResponse, ["data", 0, "data"], null);
  const docObj = { input: { ...req.body, external } };

  const opaConfig = config.getConfig()["opaConfig"];
  const opaPath = `${opaConfig["url"]}/v1/data/${name}/${type}`;

  try {
    const opaResponse = await axios.post(opaPath, docObj);
    console.log(opaResponse);

    if (opaResponse["status"] == 200) {
      res.status(200).json(opaResponse["data"]);
    } else {
      res.status(500).json(opaResponse["data"]);
    }
  } catch (e) {
    res.status(500).json(e);
  }
});
