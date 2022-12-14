const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const sauceRoutes = require('./routes/sauces');
const userRoutes = require("./routes/user");
const likeRoutes = require('./routes/likes');

const url = require('./env/UrlConnectionBDD');








const app = express();

app.use(express.json());


mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));



app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});




app.use('/images', express.static(path.join(__dirname, 'images')));



/************************************* Gestion de connection *******************/

app.use("/api/auth", userRoutes);


/************************************* Gestion des sauces ******************/

app.use("/api/sauces", sauceRoutes);


/*********************************** Gestion des likes ***************************/

app.use("/api/sauces", likeRoutes);




module.exports = app;