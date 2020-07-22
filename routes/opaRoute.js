const express = require("express");
const { opaHealth } = require("../controller/opaController");

const router = express.Router();

router.get("/health", opaHealth);

module.exports = router;
