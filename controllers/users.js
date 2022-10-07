const User = require('../models/users');
const cryptage = require('bcrypt');
const token = require('jsonwebtoken');
const emailValidator = require('../middleware/emailValidator');
const passwordValidtor = require('../middleware/passwordValidator');

exports.creatCount = (req, res, next) => {
    if (!emailValidator(req.body.email)) {
        return res.status(400).json({ message: "Adresse email incorrect" })
    };

    if (!passwordValidtor(req.body.password)) {
        return res.status(400).json({ message: "Votre mot de passe doit contenir au moins 8 caractères avec au moins un chiffre, une majuscule et un caractère spécial" })
    };
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
};


exports.loggin = (req, res, next) => {
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

}