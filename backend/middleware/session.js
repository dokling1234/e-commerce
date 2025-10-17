const session = require("express-session");

const sessionMiddleware = session({
  secret: "1-9381-297421-938132",
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }, // 7 days
});
module.exports = sessionMiddleware;
