const express = require('express');
const router = express.Router();

// Controlleur et middleware

const sauceCtrl = require('../controllers/sauces.controller');
const auth = require('../middleware/auth.middleware');
/*const verifyUser = require("../middleware/verifyUser");
const multer = require("../middleware/multerFunction");*/

// Routes CRUD

// Afficher toutes les sauces
router.get("/", auth, sauceCtrl.displaySauces);


module.exports = router;