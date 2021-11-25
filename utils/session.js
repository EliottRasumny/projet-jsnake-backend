const createSession = (req, username, token) => {
  req.session.username = username;
  req.session.token = token;
};

module.exports = { createSession };
