const express = require("express");
const bodyParser = require("body-parser");

const { insert, getData } = require("../controller/regoController");

const jsonParser = bodyParser.json();
const textParser = bodyParser.text();

const router = express.Router();

router.post("/insert", textParser, insert);
router.get("/:id", getData);

module.exports = router;
