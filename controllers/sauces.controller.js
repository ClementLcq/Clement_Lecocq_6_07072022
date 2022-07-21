const Sauce = require('../models/Sauce');
// Node FS pour gérer modif/suppression images / lien images
const fs = require('fs');

//Controllers

// Créer une sauce

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré' }))
        .catch(error => res.status(400).json({ error }));
};

// Modifier une sauce

/*exports.modifySauce = (req, res, next) => {
    Sauce.updateOne({ _id: req.params.id }, {...req.body, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié' }))
        .catch(error => res.status(400).json({ error }));
};*/

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body };
    if (sauceObject.imageUrl == null) {
        Sauce.updateOne({ _id: req.params.id }, {...sauceObject, _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Objet modifié' }))
            .catch(error => res.status(400).json({ error }));
    } else {
        Sauce.findOne({ _id: req.params.id })
            .then((sauce) => {
                const filename = sauce.imageUrl.split("/images/")[1];

                fs.unlink(`images/${filename}`, () => {
                    Sauce.updateOne({ _id: req.params.id }, {...sauceObject, _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Objet supprimé' }))
                        .catch(error => res.status(400).json({ error }));

                });
            });
    }

};

// Supprimer une sauce

/*exports.deleteSauce = (req, res, next) => {
    Sauce.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
        .catch(error => res.status(400).json({ error }));
};*/

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(thing => {
            const filename = thing.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet supprimé' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

// Afficher toutes les sauces

exports.displaySauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

// Afficher une sauce avec _id

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

// Evaluer une sauce

// Tutos : https://www.youtube.com/watch?v=3Uu11DrlEig
// https://www.youtube.com/watch?v=w8bo1DohwrA
// https://www.youtube.com/watch?v=RagSZzL2wF0
// https://www.youtube.com/watch?v=4TRMcvRua0I

exports.evaluateSauce = (req, res, next) => {
    // Récupération de la sauce avec params.id
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            switch (req.body.like) {
                // Cas #1 : si l'utilisateur dislike la sauce 
                case -1:
                    Sauce.updateOne({ _id: req.params.id }, {
                            $inc: { dislikes: 1 },
                            $push: { usersDisliked: req.body.userId },
                            _id: req.params.id
                        })
                        .then(() => res.status(201).json({ message: 'Mince, nous n\'aimez plus cette sauce' }))
                        .catch(error => res.status(400).json({ error }))
                    break;

                    // Cas #2 : si la valeur like ou dislike est différente de 0
                case 0:
                    // Cas #2-A : si la sauce est déjà likée
                    if (sauce.usersLiked.find(user => user === req.body.userId)) {
                        Sauce.updateOne({ _id: req.params.id }, {
                                $inc: { likes: -1 },
                                $pull: { usersLiked: req.body.userId },
                                _id: req.params.id
                            })
                            .then(() => res.status(201).json({ message: 'Votre avis a bien été modifié, merci' }))
                            .catch(error => res.status(400).json({ error }))
                    }

                    // Cas #2-B : Si la sauce est déjà dislikée
                    if (sauce.usersDisliked.find(user => user === req.body.userId)) {
                        Sauce.updateOne({ _id: req.params.id }, {
                                $inc: { dislikes: -1 },
                                $pull: { usersDisliked: req.body.userId },
                                _id: req.params.id
                            })
                            .then(() => res.status(201).json({ message: 'Votre avis a bien été modifié, merci' }))
                            .catch(error => res.status(400).json({ error }));
                    }
                    break;

                    // Cas #3 : si l'utilisateur like la sauce
                case 1:
                    Sauce.updateOne({ _id: req.params.id }, {
                            $inc: { likes: 1 },
                            $push: { usersLiked: req.body.userId },
                            _id: req.params.id
                        })
                        .then(() => res.status(201).json({ message: 'Super, vous adorez cette sauce!' }))
                        .catch(error => res.status(400).json({ error }));
                    break;
                default:
                    return res.status(500).json({ error });
            }
        })
        .catch(error => res.status(500).json({ error }))
}