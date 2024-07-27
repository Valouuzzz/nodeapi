   <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
            margin: 0;
            padding: 0;
            line-height: 1.6;
        }
        .container {
            width: 80%;
            margin: auto;
            overflow: hidden;
        }
        h1, h2, h3 {
            color: #333;
        }
        b {
            color: #007bff;
        }
        .note {
            background-color: #e7f1ff;
            border-left: 5px solid #007bff;
            padding: 10px;
            margin: 10px 0;
        }
        .code {
            background-color: #f8f9fa;
            border-left: 3px solid #007bff;
            padding: 10px;
            display: block;
            white-space: pre-wrap;
            overflow-x: auto;
        }
        .arrow {
            color: #007bff;
            font-size: 1.2em;
        }
        .section {
            margin: 20px 0;
        }
        .center-text {
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1 class="center-text">DESCRIPTIF DE L'API NODE</h1>

        <div class="section">
            <h2>Fonctionnement du app.js :</h2>
            <p><b>Ligne 36 :</b> <code class="code">mysql.createConnection(config.mysql)</code><br><br>
            <span class="arrow">→</span>Permet que toutes les opérations ce base sur une config définis !</p>

            <p><b>Ligne 38 :</b> <code class="code">app.use(express.static(path.join(__dirname, "/public")))</code><br><br>
            <span class="arrow">→</span>Permet la facilité d'accès au éléments et avoir un chemin direct (tirée projet entreprise)</p>

            <p><b>Ligne 40-48 :</b><br><br>
            <span class="arrow">→</span> On va venir parcourir "routeController" et ca va nous permettre de chargé le fichier avec une condition nous permettant de l'appellez avec l'objet app et la connection a la bdd et par la même occasion centraliser le tout.</p>

            <div class="note">
                <p><b>Configuration Swagger :</b> générée avec ChatGPT (trop une perte de temps sinon).</p>
            </div>
        </div>

        <div class="section">
            <h2>MISE EN MARCHE DE L'APPLICATION</h2>

            <h3 class="center-text">xx PREREQUIS xx</h3>
            <p><span class="arrow">→</span> Installation des node_modules<br>
            <code class="code">npm rebuild</code><br>
            <span class="arrow">→</span> Installation<code class="code"> nodeapi.sql | modifiez le fichier config.json (si nécessaire).</p></code><br></p>

            <h3 class="center-text">xx LANCEMENT xx</h3>
            <p><span class="arrow">→</span> Depuis le dossier</span> <code class="code">Lancer le start.bat</code> depuis l'IDE <code class="code">node app / nodemon app</code><br>
            <span class="arrow">→</span> On va sur <code class="code">127.0.0.1:5080/swagger</code><br>
            <span class="arrow">→</span> Plusieurs contrôleurs avec différentes fonctions.<br>
            <span class="arrow">→</span> Paramètres à renseigner (précision sur la page, sinon regardez en BDD).</p>

            <h3 class="center-text">xx Fonction Administrateur xx</h3>
            <p><span class="arrow">→</span> Pas disponible sur Swagger (plus de jeton, I don't know for what :'( ).<br>
            <span class="arrow">→</span> Connectez-vous sur <code class="code">/login/:utilisateur/:mdp</code><br>
            <span class="arrow">→</span> Récupérez le token.<br>
            <span class="arrow">→</span> Testez la fonction Admin.</p>
        </div>
    </div>

