const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const nunjucks = require('nunjucks');
const	users = require('./routes');
const conn = require('./models');

const app = express();


app.set('view engine', 'html');
app.engine('html', nunjucks.render);
nunjucks.configure('views', { noCache: true });

app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res)=> res.redirect('/users'))
app.use('/users', users);

app.use((err, req, res, next)=> {
  res.render('error', { error: err });
})

const port = process.env.PORT || 3000;

conn.sync().then(()=> {
  conn.seed().then(()=> {
    app.listen(port, ()=> {
      console.log(`listening on port ${port}`);
    })
  })
})
