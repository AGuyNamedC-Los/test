require('dotenv').config();
const {Pool, Client} = require("pg");
const dbENV = process.env.DB_ENVIRONMNENT || "development";

const config = {
    development: {
        user: process.env.USER,
        password: process.env.PASSWORD,
        host: process.env.HOST,
        port: process.env.PORT,
        database: process.env.DATABASE
    },
    production: {
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false
        }
    }
}

const db = new Pool(config[dbENV]);

module.exports = db;

// module.exports = {
//     query: function(text, values, cb) {
//        pg.connect(function(err, client, done) {
//             client.query(text, values, function(err, result) {
//                 done();
//                 cb(err, result);
//             });
//        });
//     }
//  };