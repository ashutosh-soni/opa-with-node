const express = require("express");
const bodyParser = require("body-parser");

const { insert, getData, publishAll } = require("../controller/regoController");

const jsonParser = bodyParser.json();
const textParser = bodyParser.text();

const router = express.Router();

router.post("/insert/:name/:type", textParser, insert);
router.get("/:name/:type", getData);
// router.put("/publishAll/:name/:type", publishAll);

module.exports = router;
