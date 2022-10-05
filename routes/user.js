const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/users')


//*****************************IDENTIFICATION***********************************************

// on crée un nouveau user
router.post('/signup', userCtrl.creatCount);
// Se connecter
router.post('/login', userCtrl.loggin);


module.exports = router;