const jwt = require('../middleware/authMiddleware');

module.exports = ({ app, connection }) => {

    app.delete('/admin_del_movie/:video_id', jwt, (req, res) => {
        if (!req.user || req.user.role !== "admin") {
            return res.status(401).send('Accès non autorisé');
        }
        try {
            const { video_id } = req.params;
            connection.query('DELETE FROM `video` WHERE `video_id` = ?', [video_id], (error, results) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({ error: 'Erreur serveur' });
                }
                if (results.affectedRows === 0) {
                    return res.status(404).json({ error: 'Vidéo non trouvée' });
                }
                return res.status(200).json({ message: 'Vidéo supprimée avec succès' });
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
    });


    app.post('/admin_add_movie/:title/:description/:release_date', jwt, (req, res) => {
        if (!req.user || req.user.role !== "admin") {
            return res.status(401).send('Accès non autorisé');
        }
        try {
            const { title, description, release_date } = req.params;
            let date_ob = new Date();
            connection.query('INSERT INTO `video` (`title`, `description`, `release_date`, `created_at`) VALUES (?, ?, ?, ?)', [title, description, release_date, date_ob], (error) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({ error: "Erreur lors de l'ajout de la vidéo" });
                }
                return res.status(200).json({ message: 'Vidéo ajoutée avec succès' });
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
    });

    app.post('/admin_edit_movie/:video_id/:title/:description/:release_date', jwt, (req, res) => {
        if (!req.user || req.user.role !== "admin") {
            return res.status(401).send('Accès non autorisé');
        }
        try {
            const { video_id, title, description, release_date } = req.params;
            let date_ob = new Date();
            connection.query('UPDATE `video` SET `title` = ?, `description` = ?, `release_date` = ?, `updated_at` = ? WHERE `video_id` = ?', [title, description, release_date, date_ob, video_id], (error, results) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({ error: 'Erreur serveur' });
                }
                if (results.affectedRows === 0) {
                    return res.status(404).json({ error: 'Vidéo non trouvé' });
                }
                return res.status(200).json({ message: 'Vidéo modifiée avec succès' });
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
    });
}
