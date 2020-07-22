const axios = require("axios");

const config = require("../config/config");

exports.opaHealth = async (req, res, next) => {
  const opaConfig = config.getConfig()["opaConfig"];
  const healthEndPoint = `${opaConfig["url"]}/health`;
  const response = await axios.get(healthEndPoint);
  res.status(response["status"]).json(response["data"]);
};
