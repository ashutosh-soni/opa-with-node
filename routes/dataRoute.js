const express = require("express");
const { insert, getData } = require("../controller/dataController");

const router = express.Router();

router.post("/insert/:name/:type", insert);
router.get("/:name/:type", getData);

module.exports = router;
