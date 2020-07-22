const { getDataFromDb } = require("../model/dataModel");
const { sendResponse } = require("../utils/apiResponse.js");
const axios = require("axios");

exports.check = async (req, res, next) => {
  const { name, type } = req.params;
  const dbResponse = await getDataFromDb({ name, type });

  const external = dbResponse["data"][0]["data"];
  const docObj = { input: { ...req.body, external } };

  try {
    const opaResponse = await axios.post(
      "http://localhost:8181/v1/data/zscontent/policy",
      docObj
    );
    //   console.log(opaResponse);

    if (opaResponse["status"] == 200) {
      res.status(200).json(opaResponse["data"]["result"]);
    } else {
      res.status(500).json(opaResponse["data"]["result"]);
    }
  } catch (e) {
    res.status(500).json(e);
  }
};
