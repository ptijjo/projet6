const Sauce = require('../models/sauces');


exports.like = (req, res, next) => {
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
};