var express = require('express');
const auth = require('../middleware/auth');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

/* Pas de code dans les routes
faire des controllers
*/

module.exports = router;