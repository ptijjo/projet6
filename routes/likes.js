const express = require('express');


const auth = require('../middleware/auth');
const likeCtrl = require('../controllers/likes');

const router = express.Router();

//****************************** LIKE DES SAUCES *********************************
// Liker une sauce
router.post('/:id/like', auth, likeCtrl.likes);












module.exports = router;