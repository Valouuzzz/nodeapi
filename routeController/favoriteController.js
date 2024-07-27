module.exports = ({ app, connection }) => {
    /**
     * @swagger
     * /favorite_list/{id}:
     *   get:
     *     tags:
     *       - Favoris
     *     summary: Récupère la liste des favoris d'un utilisateur
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         description: L'ID de l'utilisateur dont on souhaite récupérer les favoris
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Liste des favoris de l'utilisateur
     *       404:
     *         description: Aucun favori trouvé pour cet utilisateur
     *       500:
     *         description: Erreur lors de la récupération des favoris
     */
    app.get('/favorite_list/:id', async (req, res) => {
        const { id } = req.params;
        try {
            const [results] = await connection.query('SELECT * FROM `favorites` WHERE `user_id` = ?', [id]);
            if (results.length === 0) {
                return res.status(404).json({ error: "Vous n'avez aucun favori" });
            }
            return res.json(results);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erreur lors de la récupération de vos favoris' });
        }
    });

    /**
     * @swagger
     * /add_favoris/{user_id}/{video_id}:
     *   post:
     *     tags:
     *       - Favoris
     *     summary: Ajoute un favori pour un utilisateur
     *     parameters:
     *       - name: user_id
     *         in: path
     *         required: true
     *         description: L'ID de l'utilisateur
     *         schema:
     *           type: string
     *       - name: video_id
     *         in: path
     *         required: true
     *         description: L'ID de la vidéo à ajouter aux favoris
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Favori ajouté avec succès
     *       500:
     *         description: Erreur lors de l'ajout du favori
     */
    app.post('/add_favoris/:user_id/:video_id', async (req, res) => {
        const { user_id, video_id } = req.params;
        try {
            const [results] = await connection.query('INSERT INTO `favorites` (`user_id`, `video_id`) VALUES (?, ?)', [user_id, video_id]);
            if (results.affectedRows === 0) {
                return res.status(500).json({ error: "Erreur lors de l'ajout du favori" });
            }
            return res.status(200).json({ message: 'Favori ajouté avec succès' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erreur lors de l\'ajout du favori' });
        }
    });

    /**
     * @swagger
     * /del_favoris/{user_id}/{video_id}:
     *   delete:
     *     tags:
     *       - Favoris
     *     summary: Supprime un favori pour un utilisateur
     *     parameters:
     *       - name: user_id
     *         in: path
     *         required: true
     *         description: L'ID de l'utilisateur
     *         schema:
     *           type: string
     *       - name: video_id
     *         in: path
     *         required: true
     *         description: L'ID de la vidéo à retirer des favoris
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Favori supprimé avec succès
     *       500:
     *         description: Erreur lors de la suppression du favori
     */
    app.delete('/del_favoris/:user_id/:video_id', async (req, res) => {
        const { user_id, video_id } = req.params;
        try {
            const [results] = await connection.query('DELETE FROM `favorites` WHERE `user_id` = ? AND `video_id` = ?', [user_id, video_id]);
            if (results.affectedRows === 0) {
                return res.status(500).json({ error: "Erreur lors de la suppression du favori" });
            }
            return res.status(200).json({ message: 'Favori supprimé avec succès' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erreur lors de la suppression du favori' });
        }
    });
}
