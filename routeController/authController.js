const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const config = require('../config.json');

module.exports = ({ app, connection }) => {
    /**
     * @swagger
     * /register/{nom}/{password}/{role}:
     *   post:
     *     tags:
     *       - Authentification
     *     summary: Crée un nouvel utilisateur
     *     parameters:
     *       - name: nom
     *         in: path
     *         required: true
     *         description: Le nom de l'utilisateur
     *         schema:
     *           type: string
     *       - name: password
     *         in: path
     *         required: true
     *         description: Le mot de passe de l'utilisateur
     *         schema:
     *           type: string
     *       - name: role
     *         in: path
     *         required: true
     *         description: Le rôle de l'utilisateur (par exemple, "admin" ou "user")
     *         schema:
     *           type: string
     *     responses:
     *       201:
     *         description: Utilisateur créé avec succès
     *       400:
     *         description: L'utilisateur existe déjà ou erreur de validation
     *       500:
     *         description: Erreur serveur
     */
    app.post('/register/:nom/:password/:role', async (req, res) => {
        const { nom, password, role } = req.params;
        try {
            let [existingUser] = await connection.query('SELECT * FROM `user` WHERE nom = ?', [nom]);
            if (existingUser.length > 0) {
                return res.status(400).send("L'utilisateur existe déjà");
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            await connection.query('INSERT INTO `user` (nom, password, salt, role) VALUES (?, ?, ?, ?)', [nom, hashedPassword, salt, role]);

            res.status(201).send("Utilisateur créé avec succès");
        } catch (error) {
            console.error(error);
            res.status(500).send("Erreur serveur");
        }
    });

    /**
     * @swagger
     * /login/{nom}/{password}:
     *   post:
     *     tags:
     *       - Authentification
     *     summary: Authentifie un utilisateur et renvoie un token JWT
     *     parameters:
     *       - name: nom
     *         in: path
     *         required: true
     *         description: Le nom de l'utilisateur
     *         schema:
     *           type: string
     *       - name: password
     *         in: path
     *         required: true
     *         description: Le mot de passe de l'utilisateur
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Authentification réussie, token JWT renvoyé
     *       400:
     *         description: Utilisateur non trouvé ou mot de passe incorrect
     *       500:
     *         description: Erreur serveur
     */
    app.post('/login/:nom/:password', async (req, res) => {
        const { nom, password } = req.params;
        try {
            const [users] = await connection.query('SELECT * FROM `user` WHERE nom = ?', [nom]);
            if (users.length === 0) {
                return res.status(400).json("Utilisateur non trouvé");
            }

            const user = users[0];
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json("Mot de passe incorrect");
            }
            const token = jwt.sign({ id: user.ID, role: user.role }, config.jwtSecret, { expiresIn: '2d' });
            res.json({ token });
        } catch (error) {
            console.error('Erreur de serveur:', error);
            res.status(500).json("Erreur serveur");
        }
    });

    /**
     * @swagger
     * /logout:
     *   get:
     *     tags:
     *       - Authentification
     *     summary: Déconnecte l'utilisateur et supprime le cookie du token
     *     responses:
     *       200:
     *         description: Déconnexion réussie
     */
    app.get('/logout', (req, res) => {
        res.clearCookie('token');
        res.redirect('/login');
    });
};
