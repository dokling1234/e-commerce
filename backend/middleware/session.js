const session = require('express-session');

app.use(session({
  secret: 'your-secret-key',  // change to strong secret
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }  // 7 days
}));