const express = require("express");
const { insert, getData } = require("../controller/dataController");

const router = express.Router();

router.post("/insert", insert);
router.get("/", getData);

module.exports = router;
