exports.sendResponse = function (res, dbResponse) {
  if (dbResponse["isSuccess"]) {
    return res.status(200).json(dbResponse);
  } else {
    return res.status(500).json(dbResponse);
  }
};
