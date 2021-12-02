"use strict";
const { parse, serialize } = require("../utils/json");
var escape = require("escape-html");
const size = 10;

const jsonDbPath = __dirname + "/../data/bestscoressingle.json";

// Default scores
const defaultScores = [
  {
    idPlayer: 1,
    score: 600,
  },
  {
    idPlayer: 2,
    score: 500,
  },
  {
    idPlayer: 3,
    score: 400,
  },
];

class BestScoresSingle {
  constructor(dbPath = jsonDbPath, defaultItems = defaultScores) {
    this.jsonDbPath = dbPath;
    this.defaultBestScoresSingle = defaultItems;
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
   * @param {number} id - id of the player's score
   * @returns {object} the score found or undefined if the id does not lead to a score
   */
  getOne(id) {
    const scores = parse(this.jsonDbPath, this.defaultScores);
    const foundIndex = scores.findIndex((score) => score.id == id);
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

    // add new score to the scoreboard : escape the id & score in order to protect agains XSS attacks    
    const newScore = {
      idPlayer: escape(body.id),
      score: escape(body.score),
    };
    if(this.getOne(body.id)){
      // the player is already in the table => we delete it
      scores.deleteOne(body.id);
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
   * @param {number} id - id of the player's score to be deleted
   * @returns {object} the score that was deleted or undefined if the delete operation failed
   */
  deleteOne(id) {
    const scores = parse(this.jsonDbPath, this.defaultPizzas);
    const foundIndex = scores.findIndex((score) => score.id == id);
    if (foundIndex < 0) return;
    const itemRemoved = scores.splice(foundIndex, 1);
    serialize(this.jsonDbPath, scores);

    return itemRemoved[0];
  }

  /**
   * Update a score in the DB and return the updated score
   * @param {number} id - id of the player's score to be updated
   * @param {object} body - it contains all the data to be updated
   * @returns {object} the updated score or undefined if the update operation failed
   */
  updateOne(id, body) {
    const scores = parse(this.jsonDbPath, this.defaultPizzas);
    const foundIndex = scores.findIndex((score) => score.id == id);
    if (foundIndex < 0) return;
    // create a new object based on the existing score - prior to modification -
    // and the properties requested to be updated (those in the body of the request)
    // use of the spread operator to create a shallow copy and repl
    const updatedScore = { ...scores[foundIndex], ...body };
    // replace the score found at index : (or use splice)
    scores[foundIndex] = updatedScore;

    serialize(this.jsonDbPath, scores);
    return updatedScore;
  }
}

module.exports = { BestScoresSingle };