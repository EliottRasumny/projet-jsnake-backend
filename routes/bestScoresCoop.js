var express = require("express");
const { BestScoresCoop } = require("../model/bestScoresCoop");
const { authorizeFromCookie } = require("../utils/authorize");

var router = express.Router();
const bestScoresCoopModel = new BestScoresCoop();

// GET /bestScoresCoop : read all the bestScoresCoop
router.get("/bestscorescoop", function (req, res) {
  console.log("GET /bestscorescoop");
  return res.json(bestScoresCoopModel.getAll());
});

// GET /bestscorescoop/{id1}/{id2} : Get a bestScoresSingle from players' ids
router.get("/bestscorescoop/:id1/:id2", function (req, res) {
  console.log(`GET /bestscorescoop/${req.params.id1}/${req.params.id2}`);

  const bestScoreCoop = bestScoresCoopModel.getOneByIds(req.params.id1, req.params.id2);
  // Send an error code '404 Not Found' if the bestScoresCoop was not found
  if (!bestScoreCoop) return res.status(404).end();

  return res.json(bestScoreCoop);
});

module.exports = router;