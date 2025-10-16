const session = require("express-session");

const sessionMiddleware = session({
  secret: "your-secret-key",
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }, // 7 days
});
module.exports = sessionMiddleware;
