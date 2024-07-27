const jwt = require('../middleware/authMiddleware');
const bcrypt = require("bcrypt");

module.exports = ({ app, connection }) => {

    app.get('/user_list', jwt, async (req, res) => {
        if (!req.user || req.user.role !== "admin") {
            console.log("Accès refusé pour les user");
            return res.status(403).json({ error: "Accès refusé pour les utilisateurs" });
        } else {
            try {
                const [results] = await connection.query('SELECT * FROM `user`');
                if (results.length === 0) {
                    return res.status(404).json({ error: "Pas d'utilisateur" });
                }
                return res.json(results);
            } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Erreur lors de la récupération des utilisateur' });
            }
        }
    });

    app.get('/user_list/:id', jwt, async (req, res) => {
        const { id } = req.params;

        if (!req.user || req.user.role !== "admin") {
            console.log("Accès refusé pour les user");
            return res.status(403).json({ error: "Accès refusé pour les utilisateur" });
        } else {
            try {
                const [results] = await connection.query('SELECT * FROM `user` WHERE `ID` = ?', [id]);
                if (results.length === 0) {
                    return res.status(404).json({ error: "l'utilisateur n'existe pas" });
                }
                return res.json(results[0]);
            } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Erreur lors de la récuperation des utilisateurs' });
            }
        }
    });


    app.post('/edit_user/:id/:nom/:password', jwt, async (req, res) => {
        const { id } = req.params;
        const { nom, password } = req.params;

        if (!req.user || req.user.role !== "admin") {
            console.log("Accès refusé");
            return res.status(403).json({ error: "Accès refusé" });
        } else {
            try {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);
                const [results] = await connection.query('UPDATE `user` SET nom = ?, password = ?, salt = ? WHERE ID = ?', [nom, hashedPassword, salt, id]);
                if (results.affectedRows === 0) {
                    return res.status(404).json({ error: "Utilisateur n'existe pas" });
                }
                return res.json({ message: "Utilisateur mis à jour avec succès" });
            } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'utilisateur' });
            }
        }
    });
};
