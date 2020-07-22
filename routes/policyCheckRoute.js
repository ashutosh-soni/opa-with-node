const express = require("express");
const { check } = require("../controller/policyCheckController");

const router = express.Router();

router.post("/:name/:type", check);

module.exports = router;
