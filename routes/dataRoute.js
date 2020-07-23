const express = require("express");
const { insert, getData, update } = require("../controller/dataController");

const router = express.Router();

router.post("/insert/:name/:type", insert);
router.put("/update/:name/:type/:id", update);
router.get("/:name/:type", getData);

module.exports = router;
