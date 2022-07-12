var express = require('express');
var router = express.Router();
const userCtrl = require('../controllers/user');

/* GET users listing. */
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;