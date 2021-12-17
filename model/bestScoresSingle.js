"use strict";
const { parse, serialize } = require("../utils/json");
var escape = require("escape-html");
const size = 10;

const jsonDbPath = __dirname + "/../data/bestscoressingle.json";

// Default scores
const defaultScores = [
  {
    username: "admin",
    score: 600,
  },
  {
    username: "zoe",
    score: 500,
  },
  {
    username: "eliott",
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
    console.log("get all");
    const scores = parse(this.jsonDbPath, this.defaultBestScoresSingle);
    return scores;
  }

  /**
   * Returns the scores identified by player's username
   * @param {number} username - username of the user's score
   * @returns {object} the score found or undefined if the id does not lead to a score
   */
  getOne(username) {
    console.log("username");
    const scores = parse(this.jsonDbPath, this.defaultBestScoresSingle);
    const foundIndex = scores.findIndex((score) => score.username == username);
    if (foundIndex < 0) return;

    return scores[foundIndex];
  }

  /**
   * Add a score in the DB and returns the added score
   * @param {object} body - it contains all required data to create a score
   * @returns {object} the score that was created (with id)
   */

  addOne(body) {
    const scores = parse(this.jsonDbPath, this.defaultBestScoresSingle);

    // add new score to the scoreboard : escape the id & score in order to protect agains XSS attacks    
    const newScore = {
      username: escape(body.username),
      score: escape(body.score),
    };
    if(this.getOne(body.username)){
      // the player is already in the table => we delete it
      scores.deleteOne(body.username);
    }

    var j;
    var scoreAjoute = false;
    for(j = 0; j < scores.length; j++){
      if(newScore.score >= scores[j]){
        scores.splice(j, 0, newScore);
        scoreAjoute = true;
        break;
      } 
    }
    if(scores.length === size && scoreAjoute) scores.pop;
    serialize(this.jsonDbPath, scores);
    return newScore;
  }


  /**
   * Delete a score in the DB and return the deleted score
   * @param {string} username - username of the player's score to be deleted
   * @returns {object} the score that was deleted or undefined if the delete operation failed
   */
  deleteOne(username) {
    const scores = parse(this.jsonDbPath, this.defaultBestScoresSingle);
    const foundIndex = scores.findIndex((score) => score.username == id);
    if (foundIndex < 0) return;
    const itemRemoved = scores.splice(foundIndex, 1);
    serialize(this.jsonDbPath, scores);

    return itemRemoved[0];
  }

  /**
   * Update a score in the DB and return the updated score
   * @param {string} username - username of the player's score to be updated
   * @param {object} body - it contains all the data to be updated
   * @returns {object} the updated score or undefined if the update operation failed
   */
  updateOne(username, body) {
    const scores = parse(this.jsonDbPath, this.defaultBestScoresSingle);
    const foundIndex = scores.findIndex((score) => score.username == username);
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