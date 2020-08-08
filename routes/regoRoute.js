const express = require("express");
const bodyParser = require("body-parser");

const {
  insert,
  getRego,
  getRegoById,
  update,
  publishAll,
} = require("../controller/regoController");

const jsonParser = bodyParser.json();
const textParser = bodyParser.text();

const router = express.Router();

router.post("/insert/:name/:type", textParser, insert);
router.put("/update/:name/:type/:id", textParser, update);
router.get("/:name/:type", getRego);
router.get("/:name/:type/:id", getRegoById);
router.get("/publishAll", publishAll);

module.exports = router;
