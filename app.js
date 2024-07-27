const express = require("express");
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const config = require('./config.json');
const app = express();
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'NODE API',
            version: '1.0.0',
            description: '## Consigne - API Documentation (Swagger)\n',
        },
    },
    apis: ['./routeController/*.js'],
};


const swaggerDocs = swaggerJsdoc(swaggerOptions);


// Middleware pour servir la documentation Swagger
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

mysql.createConnection(config.mysql)
    .then(async (connection) => {
        app.use(express.static(path.join(__dirname, "/public")));

        const controllers = path.join(__dirname, "routeController");
        fs.readdirSync(controllers).forEach(function (file) {
            const controller = require(path.join(controllers, file));
            if (typeof controller === 'function') {
                controller({ app, connection });
            } else {
                console.error(`Module ${file} ne contient pas de fonction`);
            }
        });

        app.listen(config.webApi.port, () => {
            console.log(`Serveur démarré sur le port ${config.webApi.port}`);
        });
    })
    .catch((err) => {
        console.error('Erreur mysql connection : ' + err.stack);
    });
