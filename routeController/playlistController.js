module.exports = ({ app, connection }) => {
    /**
     * @swagger
     * tags:
     *   - name: Playlist
     */

    /**
     * @swagger
     * /create_playlist/{user_id}/{nom}/{statue}:
     *   post:
     *     tags:
     *       - Playlist
     *     summary: Crée une nouvelle playlist
     *     parameters:
     *       - name: user_id
     *         in: path
     *         required: true
     *         description: L'ID de l'utilisateur qui crée la playlist
     *         schema:
     *           type: string
     *       - name: nom
     *         in: path
     *         required: true
     *         description: Le nom de la playlist
     *         schema:
     *           type: string
     *       - name: statue
     *         in: path
     *         required: true
     *         description: Le statut de la playlist
     *         schema:
     *           type: string
     *           enum:
     *             - vu
     *             - en cours
     *             - a voir
     *     responses:
     *       201:
     *         description: Playlist créée avec succès
     *       400:
     *         description: Statut invalide
     *       500:
     *         description: Erreur serveur
     */
    app.post('/create_playlist/:user_id/:nom/:statue', async (req, res) => {
        const { user_id, nom, statue } = req.params;
        try {
            if (statue !== "vu" && statue !== "en cours" && statue !== "a voir") {
                return res.status(400).json({ error: 'Le statut doit être : "vu, en cours, a voir"' });
            }
            const [results] = await connection.query('INSERT INTO `playlist` (`nom`, `user_id`, `statue`) VALUES (?, ?, ?)', [nom, user_id, statue]);

            if (results.affectedRows === 0) {
                return res.status(404).json({ error: 'Film ou série non trouvé' });
            }
            return res.status(201).json({ message: 'Playlist créé avec succès' });
        } catch (error) {
            return res.status(500).json({ error: 'Erreur lors de la création de la playlist' });
        }
    });

    /**
     * @swagger
     * /add_movie_playlist/{playlist_id}/{video_id}:
     *   post:
     *     tags:
     *       - Playlist
     *     summary: Ajoute un film à une playlist
     *     parameters:
     *       - name: playlist_id
     *         in: path
     *         required: true
     *         description: L'ID de la playlist
     *         schema:
     *           type: string
     *       - name: video_id
     *         in: path
     *         required: true
     *         description: L'ID de la vidéo
     *         schema:
     *           type: string
     *     responses:
     *       201:
     *         description: Vidéo ajoutée avec succès
     *       404:
     *         description: Playlist ou vidéo non trouvée
     *       500:
     *         description: Erreur serveur
     */
    app.post('/add_movie_playlist/:playlist_id/:video_id', async (req, res) => {
        const { playlist_id, video_id } = req.params;
        try {

            let doublon = await connection.query(
                'SELECT * FROM `playlist_video` WHERE `playlist_id` = ? AND `video_id` = ?', [playlist_id, video_id]);

            if (doublon != null) {
                return res.status(400).json({ error: 'Cette vidéo est déjà dans cette playlist' });
            }

            const [results] = await connection.query('INSERT INTO `playlist_video` (`playlist_id`, `video_id`) VALUES (?, ?)', [playlist_id, video_id]);
            if (results.affectedRows === 0) {
                return res.status(404).json({ error: 'Film ou série non trouvé' });
            }
            return res.status(201).json({ message: 'Vidéo ajouté avec succès !' });
        } catch (error) {
            return res.status(500).json({ error: 'Erreur lors de l\'ajout de la vidéo à la playlist' });
        }
    });

    /**
     * @swagger
     * /del_movie_playlist/{playlist_id}/{video_id}:
     *   delete:
     *     tags:
     *       - Playlist
     *     summary: Supprime un film d'une playlist
     *     parameters:
     *       - name: playlist_id
     *         in: path
     *         required: true
     *         description: L'ID de la playlist
     *         schema:
     *           type: string
     *       - name: video_id
     *         in: path
     *         required: true
     *         description: L'ID de la vidéo
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Vidéo supprimée avec succès
     *       404:
     *         description: Vidéo non trouvée
     *       500:
     *         description: Erreur serveur
     */
    app.delete('/del_movie_playlist/:playlist_id/:video_id', async (req, res) => {
        const { playlist_id, video_id } = req.params;
        try {
            const [results] = await connection.query('DELETE FROM `playlist_video` WHERE `playlist_id` = ? AND `video_id` = ?', [playlist_id, video_id]);

            if (results.affectedRows === 0) {
                return res.status(404).json({ error: 'Aucune vidéo trouvée' });
            }
            return res.status(200).json({ message: 'Vidéo supprimée avec succès !' });
        } catch (error) {
            return res.status(500).json({ error: 'Erreur lors de la suppression de la vidéo de la playlist' });
        }
    });
};
