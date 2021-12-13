var express = require("express");
var router = express.Router();
const { Users } = require("../model/users");
const userModel = new Users();

/* Register a user : POST /auths/register */
router.post("/register", async function (req, res, next) {
  // Send an error code '400 Bad request' if the body parameters are not valid
  if (
    !req.body ||
    (req.body.hasOwnProperty("username") && req.body.username.length === 0) ||
    (req.body.hasOwnProperty("password") && req.body.password.length === 0)
  )
    return res.status(400).end();

  const authenticatedUser = await userModel.register(
    req.body.username,
    req.body.password
  );
  // Error code '409 Conflict' if the username already exists
  if (!authenticatedUser) return res.status(409).end();

  // Create the session data (to be put into a cookie)
  req.session.username1 = authenticatedUser.username;
  req.session.token1 = authenticatedUser.token;

  return res.json({ username: authenticatedUser.username });
});

/* login the first user : POST /auths/login1 */
router.post("/login1", async function (req, res, next) {
  // Send an error code '400 Bad request' if the body parameters are not valid
  if (
    !req.body ||
    (req.body.hasOwnProperty("username") && req.body.username.length === 0) ||
    (req.body.hasOwnProperty("password") && req.body.password.length === 0)
  )
    return res.status(400).end();

  const authenticatedUser = await userModel.login(
    req.body.username,
    req.body.password
  );
  // Error code '401 Unauthorized' if the user could not be authenticated
  if (!authenticatedUser) return res.status(401).end();

  // Create the session data (to be put into a cookie)
  req.session.username1 = authenticatedUser.username;
  req.session.token1 = authenticatedUser.token;

  return res.json({ username1: authenticatedUser.username });
});

/* login the second user : POST /auths/login2 */
router.post("/login2", async function (req, res, next) {
  // Send an error code '400 Bad request' if the body parameters are not valid
  if (
    !req.body ||
    (req.body.hasOwnProperty("username") && req.body.username.length === 0) ||
    (req.body.hasOwnProperty("password") && req.body.password.length === 0)
  )
    return res.status(400).end();

  const authenticatedUser = await userModel.login(
    req.body.username,
    req.body.password
  );
  // Error code '401 Unauthorized' if the user could not be authenticated
  if (!authenticatedUser) return res.status(401).end();

  // Create the session data (to be put into a cookie)
  req.session.username2 = authenticatedUser.username;
  req.session.token2 = authenticatedUser.token;

  return res.json({ username2: authenticatedUser.username });
});

/* Logout a/all user(s) : POST /auths/logout */
router.get("/logout", async function (req, res, next) {
  req.session = null;
  return res.status(200).end();
});


router.get("/", async function (req, res, next) {
  return res.json("test");
});

module.exports = router;
