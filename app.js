const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fs = require('fs');

const User = require('./models/users');
const Sauce = require('./models/sauces');

const cryptage = require('bcrypt');
const token = require('jsonwebtoken');
const auth = require('./middleware/auth');
const multer = require('./middleware/multer-config');
const path = require('path');




const app = express();

app.use(express.json());


mongoose.connect('mongodb+srv://ptijjo:francoise56@opcp6.2crxyfc.mongodb.net/?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));



app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, 'images')));

console.log('/images', path.join(__dirname, 'images'));
//*****************************IDENTIFICATION***********************************************

// on crée un nouveau user
app.post('/api/auth/signup', (req, res, next) => {
  cryptage.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });

      User.findOne({ email: req.body.email })
        .then(mail => {
          if (mail) {
            return res.json({ message: 'Utilisateur déja existant' });

          }
          else {
            user.save()
              .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
              .catch(error => res.status(400).json({ error }));
          }
        })
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
});
// Se connecter
app.post('/api/auth/login', (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) return res.status(401).json({ message: 'Identifiants incorrects' });
      cryptage.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) return res.status(401).json({ message: 'Identifiants incorrecte' });
          else return res.status(200).json({
            userId: user._id,
            token: token.sign(
              { userId: user._id },
              "RANDOM_TOKEN_SECRET",
              { expiresIn: "24h" },
            )
          });
        })

        .catch(error => res.status(500).json({ error }));

    })

    .catch(error => res.status(404).json({ error }));

});

//********************************* SAUCES *************************************************

// Rechercher des sauces
app.get('/api/sauces', auth, (req, res, next) => {
  Sauce.find()
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(400).json({ error }));
});
// Rechercher une sauce
app.get('/api/sauces/:id', auth, (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
});
// Ajouter une sauce
app.post('/api/sauces', auth, multer, (req, res, next) => {
  const sauceObjet = JSON.parse(req.body.sauce);
  delete sauceObjet._id;
  delete sauceObjet._userId;
  const url = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`.split(' ').join('');
  const sauce = new Sauce({
    ...sauceObjet,
    userId: req.auth.userId,
    imageUrl: url,
    usersLiked: [],
    usersDisliked: [],
  });

  console.log(url);


  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce créé !' }))
    .catch(error => res.status(400).json({ error }));

});
// modifier une sauce
app.put('/api/sauces/:id', auth, multer, (req, res, next) => {
  const sauceObjet = req.file ? {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
  } : { ...req.body };
  delete sauceObjet._userId;
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: 'Not authorized' });
      }
      else {
        Sauce.updateOne({ _id: req.params.id }, { ...sauceObjet, _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce modifiée!' }))
          .catch(error => res.status(401).json({ error }));
      }
    })


    .catch(error => res.status(400).json({ error }));
});
// supprimer une sauce
app.delete('/api/sauces/:id', auth, multer, (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      if (sauce.userId != req.auth.userId) {
        res.status(201).json({ message: "Non authorisé" });
      }
      else {
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Sauce supprimée !" });
            })

            .catch(error => res.status(401).json({ error }));
        });

      }

    })

    .catch(error => res.status(500).json({ error }));
});
//****************************** LIKE DES SAUCES *********************************
// Liker une sauce
app.post('/api/sauces/:id/like', auth, (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      // --------------------------- Fonction like ---------------------------------------------------------------------------
      if (!sauce.usersLiked.includes(req.body.userId) && req.body.like === 1) {
        Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: 1 }, $push: { usersLiked: req.body.userId } })
          .then(() => res.status(201).json({ message: "User a liké" }))
          .catch((error) => res.status(400).json({ error }));
      }

      else if (sauce.usersLiked.includes(req.body.userId) && req.body.like === 0) {
        Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: -1 }, $pull: { usersLiked: req.body.userId } })
          .then(() => res.status(201).json({ message: "User a retiré son like" }))
          .catch((error) => res.status(400).json({ error }));
      }
      // ***************************** fin fonction like *********************************************************************

      //---------------------------fonction dislike --------------------------------------------------------------------------
      if (!sauce.usersDisliked.includes(req.body.userId) && req.body.like === -1) {
        Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: 1 }, $push: { usersDisliked: req.body.userId } })
          .then(() => res.status(201).json({ message: "User a disliké" }))
          .catch((error) => res.status(400).json({ error }));
      }

      else if (sauce.usersDisliked.includes(req.body.userId) && req.body.like === 0) {
        Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId } })
          .then(() => res.status(201).json({ message: "User a retiré son dislike" }))
          .catch((error) => res.status(400).json({ error }));
      }

      //**********************************fin fonction dislike **************************************************************
    })
    .catch(error => res.status(404).json({ error }));






});


module.exports = app;