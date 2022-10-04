const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const likeCtrl = require('../controllers/likes');



//****************************** LIKE DES SAUCES *********************************
// Liker une sauce
router.post('/:id/like', auth, likeCtrl.like);

module.exports = router;