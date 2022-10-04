const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoute = require('./routes/users');
const sauceRoute = require('./routes/sauces');
const likeRoute = require('./routes/likes');





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

//*****************************IDENTIFICATION***********************************************

// Gestion des utilisateurs
app.use("/api/auth", userRoute);


// Gestion des sauces
app.use("/api/sauces", sauceRoute);

//Gestion des likes

app.use("/api/sauces", likeRoute);






module.exports = app;