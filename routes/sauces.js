const express = require('express');
const router = express.Router();
const sauceCtrl = require("../controllers/sauces");
const multer = require('../middleware/multer-config');
const auth = require('../middleware/auth');



//********************************* SAUCES *************************************************

// Rechercher des sauces
router.get('/', auth, sauceCtrl.findAll);


// Rechercher une sauce
router.get('/:id', auth, sauceCtrl.findOne);


// Ajouter une sauce
router.post('/', auth, multer, sauceCtrl.add);



// modifier une sauce
router.put('/:id', auth, multer, sauceCtrl.modify);



// supprimer une sauce
router.delete('/:id', auth, multer, sauceCtrl.delete);


module.exports = router;