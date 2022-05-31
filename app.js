const express = require('express');
const debug = require('debug')('app');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const port = process.env.PORT || 3000;
const app = express();
const adminRouter = require('./src/routes/support/adminRouter.js');
const authRouter = require('./src/routes/support/authRouter.js');
const jobsRouter = require('./src/routes/jobs/jobRouter.js');

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.json());
app.use(express.urlencoded( { extended: false } ));
//cookieParser
app.use(session({ secret: 'n2la' }));

require('./src/config/passport.js')(app);

app.set('views', './src/views');
app.set('view engine', 'ejs');

app.use('/admin', adminRouter);
app.use('/auth', authRouter);
app.use('/jobs', jobsRouter);

app.get('/', (req, res) => {
  res.render('home', {
    title: 'someTitle',
    someData: ['so', 'me', 'da', 'ta']
  });
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
