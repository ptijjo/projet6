const fs = require('fs');
const Sauce = require("../models/sauces");


exports.add = (req, res, next) => {
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

};




exports.search = (req, res, next) => {
    Sauce.find()
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(400).json({ error }));
};



exports.searchOne = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};


exports.modify = (req, res, next) => {
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
};

exports.delete = (req, res, next) => {
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
};