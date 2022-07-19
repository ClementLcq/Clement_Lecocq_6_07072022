const express = require('express');
const router = express.Router();

// Controlleur et middleware

const sauceCtrl = require('../controllers/sauces.controller');
const auth = require('../middleware/auth.middleware');
const multer = require("../middleware/multerFunctions");

/*const verifyUser = require("../middleware/verifyUser");*/

// Routes CRUD

router.post("/", auth, multer, sauceCtrl.createSauce);
router.get("/", auth, sauceCtrl.displaySauces);


module.exports = router;