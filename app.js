var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const limiter = require('./middleware/rateLimiter.middleware');
const { default: rateLimit } = require('express-rate-limit');

// Utilisation dotenv
const dotenv = require('dotenv');
dotenv.config();
const url = process.env.MONGOLAB_URI;

//Installation add-on securité
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');


var saucesRouter = require('./routes/sauces.routes');
var authRouter = require('./routes/auth.routes');

var app = express();
app.use(helmet());
app.use(mongoSanitize());


mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader("Cross-Origin-Resource-Policy", "same-site");
    next();
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/sauces', saucesRouter);
app.use('/api/auth', authRouter);
app.use('/images', express.static(path.join(__dirname, 'images')));



// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;