var express = require("express");
const { BestScoresSingle } = require("../model/bestScoresSingle");
const { authorizeFromCookie } = require("../utils/authorize");
const { authorize } = require("../utils/authorize");

var router = express.Router();
const bestScoresSingleModel = new BestScoresSingle();

// GET /bestScoresSingle : read all the bestScoresSingle from the menu
router.get("/bestscoressingle", function (req, res) {
  console.log("GET /bestscoressingle");
  return res.json(bestScoresSingleModel.getAll());
});

// GET /bestscoressingle/{id} : Get a bestScoresSingle from its id in the menu
router.get("/bestscoressingle/:id", function (req, res) {
  console.log(`GET /bestscoressingle/${req.params.id}`);

  const bestScoresSingle = bestScoresSingleModel.getOne(req.params.id);
  // Send an error code '404 Not Found' if the bestScoresSingle was not found
  if (!bestScoresSingle){
    console.log("not found");
    return res.status(404).end();
  } 

  return res.json(bestScoresSingle);
});

// POST /bestscoressingle/{score}/{id} : Add the best score "score" for the player's id
router.post("/bestscoressingle/", authorize, function (req, res) {
  console.log("POST /bestscoressingle");

  // Send an error code '400 Bad request' if the body parameters are not valid
  if (
    !req.body ||
    (req.body.hasOwnProperty("score") && req.body.title.length === 0) ||
    (req.body.hasOwnProperty("id") && req.body.content.length === 0)
  )
    return res.status(400).end();

  const score = bestScoresSingleModel.addOne(req.body);

  return res.json(score);
});


module.exports = router;