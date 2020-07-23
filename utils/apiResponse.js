exports.sendResponse = function (res, dbResponse) {
  if (dbResponse["isSuccess"]) {
    return res.status(200).json(dbResponse);
  } else {
    return res.status(500).json(dbResponse);
  }
};

exports.validationError = function (res, msg) {
  var resData = {
    success: false,
    message: msg,
  };
  return res.status(400).json(resData);
};

exports.ErrorResponse = function (res, msg) {
  var data = {
    success: false,
    message: msg,
  };
  return res.status(500).json(data);
};
