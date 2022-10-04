const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/users');





// S'enregistrer
router.post('/signup', userCtrl.register);


// Se connecter
router.post('/login', userCtrl.logging);

module.exports = router;