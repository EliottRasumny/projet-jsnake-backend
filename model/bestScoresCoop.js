"use strict";
const { parse, serialize } = require("../utils/json");
var escape = require("escape-html");
const size = 10;

const jsonDbPath = __dirname + "/../data/bestscorescoop.json";

// Default pizza menu
const defaultScores = [
  {
    idPlayer1: 1,
    idPlayer2: 2,
    score: 600,
  },
  {
    idPlayer1: 2,
    idPlayer2: 4,
    score: 500,
  },
  {
    idPlayer1: 3,
    idPlayer2: 1,
    score: 400,
  },
];

class BestScoresCoop {
  constructor(dbPath = jsonDbPath, defaultItems = defaultScores) {
    this.jsonDbPath = dbPath;
    this.defaultBestScoresCoop = defaultItems;
  }

  /**
   * Returns all scores
   * @returns {Array} Array of scores
   */
  getAll() {
    const scores = parse(this.jsonDbPath, this.defaultScores);
    return scores;
  }

  /**
   * Returns the scores identified by player's id
   * @param {number} id - id of the pizza to find
   * @returns {object} the pizza found or undefined if the id does not lead to a pizza
   */
  getOne(id) {
    const scores = parse(this.jsonDbPath, this.defaultScores);
    const foundIndex = scores.findIndex((score) => score.idPlayer1 == id || score.idPlayer2 == id);
    if (foundIndex < 0) return;

    return scores[foundIndex];
  }

  /**
   * Returns the scores identified by player's id
   * @param {number} id - id of the pizza to find
   * @returns {object} the pizza found or undefined if the id does not lead to a pizza
   */
   getOneByIds(id1, id2) {
    const scores = parse(this.jsonDbPath, this.defaultScores);
    const foundIndex = scores.findIndex((score) => score.idPlayer1 == id && score.idPlayer2 == id);
    if (foundIndex < 0) return;

    return scores[foundIndex];
  }

  /**
   * Add a score in the DB and returns the added score
   * @param {object} body - it contains all required data to create a score
   * @returns {object} the score that was created (with id)
   */

  addOne(body) {
    const scores = parse(this.jsonDbPath, this.defaultScores);
   
    const newScore = {
      idPlayer1: escape(body.id1),
      idPlayer2: escape(body.id2),
      score: escape(body.score),
    };

    if(this.getOneByIds(newScore.idPlayer1, newScore.idPlayer2)){
      // the player is already in the table => we delete it
      scores.deleteOne(newScore.idPlayer1, newScore.idPlayer2);
    }
    var i = 0;
    var scoreAjoute = false;
    scores.forEach(score => {
      if(newScore.score >= score){
        scores.splice(i, 0, newScore);
        scoreAjoute = true;
        break;
      } 
      i++;
    });
    if(scores.length === size && scoreAjoute) scores.pop;
    serialize(this.jsonDbPath, scores);
    return newScore;
  }

  /**
   * Delete a score in the DB and return the deleted score
   * @param {number} id1 - id of the first player
   * @param {number} id2 - id of the second player
   * @returns {object} the score that was deleted or undefined if the delete operation failed
   */
  deleteOne(id1, id2) {
    const scores = parse(this.jsonDbPath, this.defaultPizzas);
    const foundIndex = scores.findIndex((score) => score.idPlayer1 == id && score.idPlayer2 == id);
    if (foundIndex < 0) return;
    const itemRemoved = scores.splice(foundIndex, 1);
    serialize(this.jsonDbPath, scores);

    return itemRemoved[0];
  }

  /**
   * Update a score a in the DB and return the updated score
   * @param {number} id1 - id of the first player
   * @param {number} id2 - id of the second player
   * @param {object} body - it contains all the data to be updated
   * @returns {object} the updated score or undefined if the update operation failed
   */
  updateOne(id1, id2, body) {
    const scores = parse(this.jsonDbPath, this.defaultScores);
    const foundIndex = scores.findIndex((score) => score.idPlayer1 == id && score.idPlayer2 == id);
    if (foundIndex < 0) return;
    // create a new object based on the existing score - prior to modification -
    // and the properties requested to be updated (those in the body of the request)
    // use of the spread operator to create a shallow copy and repl
    const updatedScore = { ...scores[foundIndex], ...body };
    // replace the pizza found at index : (or use splice)
    scores[foundIndex] = updatedScore;

    serialize(this.jsonDbPath, scores);
    return updatedScore;
  }
}

module.exports = { BestScoresCoop };