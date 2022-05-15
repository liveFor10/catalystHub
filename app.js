const express = require('express');
const debug = require('debug')('app');
const path = require('path');

const port = process.env.PORT || 3000;
const app = express();

const authRouter = require('./src/routes/authRouter.js');

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.json());
app.use(express.urlencoded( { extended: false } ));

app.set('views', './src/views');
app.set('view engine', 'ejs');

app.use('/auth', authRouter);

app.get('/', (req, res) => {
  res.render('index', { title: 'someTitle', someData: ['so', 'me', 'da', 'ta'] });
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
