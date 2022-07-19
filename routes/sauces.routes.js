const express = require('express');
const router = express.Router();

// Controlleur et middleware

const sauceCtrl = require('../controllers/sauces.controller');
const auth = require('../middleware/auth.middleware');
const multer = require("../middleware/multerFunctions");

/*const verifyUser = require("../middleware/verifyUser");*/

// Routes CRUD

router.post("/", auth, multer, sauceCtrl.createSauce);
router.get("/:id", auth, sauceCtrl.getOneSauce);
router.delete("/:id", sauceCtrl.deleteSauce); //Ajouter une fonction pour vérifier si c'est bien le créateur qui supprime la sauce ?
router.put("/:id", multer, sauceCtrl.modifySauce); //Ajouter une fonction pour vérifier si c'est bien le créateur qui modifie la sauce ?
router.get("/", auth, sauceCtrl.displaySauces);
router.post("/:id/like", auth, sauceCtrl.evaluateSauce);


module.exports = router;