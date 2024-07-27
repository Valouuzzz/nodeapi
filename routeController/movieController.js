
module.exports = ({ app, connection }) => {
    /**
     * @swagger
     * /list-movie:
     *   get:
     *     tags:
     *       - Films
     *     summary: Récupère la liste de tous les films
     *     responses:
     *       200:
     *         description: Liste des films récupérée avec succès
     *       500:
     *         description: Erreur lors de la récupération des films
     */
    app.get('/list-movie', async (req, res) => {
        try {
            const [results] = await connection.query('SELECT * FROM `video`');
            res.json(results);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la récupération des films' });
        }
    });

    /**
     * @swagger
     * /movie/{id}:
     *   get:
     *     tags:
     *       - Films
     *     summary: Récupère les détails d'un film par son ID
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         description: L'ID du film à récupérer
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Détails du film récupérés avec succès
     *       404:
     *         description: Film ou série non trouvé
     *       500:
     *         description: Erreur lors de la récupération du film ou de la série
     */
    app.get('/movie/:id', async (req, res) => {
        const { id } = req.params;

        try {
            const [results] = await connection.query('SELECT * FROM `video` WHERE `video_id` = ?', [id]);
            if (results.length === 0) {
                return res.status(404).json({ error: 'Film ou série non trouvé' });
            }
            return res.json(results[0]);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erreur lors de la récupération du film ou de la série' });
        }
    });

    /**
     * @swagger
     * /view_movie/{video_id}/{status}:
     *   post:
     *     tags:
     *       - Favoris
     *     summary: Ajoute un film aux favoris avec un statut
     *     parameters:
     *       - name: video_id
     *         in: path
     *         required: true
     *         description: L'ID du film à ajouter aux favoris
     *         schema:
     *           type: string
     *       - name: status
     *         in: path
     *         required: true
     *         description: Le statut du film (par exemple, "vu", "à voir", etc.)
     *         schema:
     *           type: string
     *           enum:
     *             - vu
     *             - en cours
     *             - à voir
     *     responses:
     *       200:
     *         description: Film ajouté aux favoris avec succès
     *       404:
     *         description: Film non trouvé ou erreur dans le processus
     *       500:
     *         description: Erreur lors de l'ajout du film aux favoris
     */
    app.post('/view_movie/:video_id/:status', async (req, res) => {
        const { video_id, status } = req.params;
        // Assurez-vous que vous utilisez un middleware pour obtenir user_id
        const user_id = req.user.id; // Utilisation correcte du user_id depuis les informations de l'utilisateur

        try {
            const [results] = await connection.query('INSERT INTO `favorites` (`user_id`, `video_id`, `status`) VALUES (?, ?, ?)', [user_id, video_id, status]);
            if (results.affectedRows === 0) {
                return res.status(404).json({ error: 'Film ou série non trouvé' });
            }
            return res.status(200).json({ message: 'Film ajouté aux favoris avec succès' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erreur lors de l\'ajout du film aux favoris' });
        }
    });
};
