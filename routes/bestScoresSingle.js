var express = require("express");
const { Pizzas } = require("../model/bestScoresSingle");
const { authorizeFromCookie } = require("../utils/authorize");

var router = express.Router();
const bestScoresSingleModel = new BestScoresSingle();

// GET /bestScoresSingle : read all the bestScoresSingle from the menu
router.get("/", function (req, res) {
  console.log("GET /bestscoressingle");
  return res.json(bestScoresSingleModel.getAll());
});

// GET /bestscoressingle/{id} : Get a bestScoresSingle from its id in the menu
router.get("/:id", function (req, res) {
  console.log(`GET /bestscoressingle/${req.params.id}`);

  const bestScoresSingle = bestScoresSingleModel.getOne(req.params.id);
  // Send an error code '404 Not Found' if the bestScoresSingle was not found
  if (!bestScoresSingle) return res.status(404).end();

  return res.json(bestScoresSingle);
});

module.exports = router;