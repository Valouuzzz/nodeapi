const mysql = require('mysql2/promise');
const config = require('../config.json');

let bddEt = async () => {
    let bddEtConn = await mysql.createConnection(config.mysql);

    setInterval(async () => {
        await bddEtConn.query('SELECT count(*)');
        console.log('maintien connection');
    }, 14400000);

    return bddEtConn;
};

exports.bddEt = bddEt;
