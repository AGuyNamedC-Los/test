require('dotenv').config();
const express = require('express');
const session = require('express-session');
const nunjucks = require('nunjucks');
const setupMiddleware = require('../authentication/setupMiddleware');
const usersOnly = require('../authentication/usersOnlyMiddleware');
const authenticateRouter = require('../authentication/authentication-routes');
const profileRouter = require('../routes/profile-routes');
const searchRouter = require('../routes/search-routes');
const pool = require("../db");
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

var server = express();
const sessionConfig = {
    name: "YUMMY",
    secret: process.env.SECRET,
    cookie: {
        secure: false,
        httpOnly: true,
    },
    resave: false,
    saveUninitialized: true
};

server.use(session(sessionConfig));  // so the session has a cookie
server.use(setupMiddleware);    // so the session has middleware
server.use(express.json());
server.use(express.static('public'));  // allows the use of the public directory which includes the css
var urlencodedParser = express.urlencoded({extended: true});

nunjucks.configure('templates', {
    autoescape: true,
    express: server
});

const template = nunjucks.precompile(
    './templates/base.njk',
    {name: "base"}
);

server.get('/', (req, res) => {
    res.render('home.njk', {user: req.session.user});
});

server.get('/login', (req, res) => { 
    res.render('login.html', {user: req.session.user}); 
});

server.get('/sign-up', (req, res) => {
    res.render('sign_up.html', {user: req.session.user});
});

server.use('/api/search', searchRouter);
server.use('/api/authenticate', authenticateRouter);
server.use('/api/profile', usersOnly, profileRouter);

module.exports = server;

server.get("/users", async (req, res) => {
    try {
        const allUsers = await pool.query("SELECT * FROM users");
        res.json(allUsers.rows);
      } catch (err) {
        console.error(err.message);
      }
});

server.post("/users", urlencodedParser, async (req, res) => {
    try {
        const credentials = req.body
        const {email, firstname, lastname, username, password} = credentials;

        bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS), async function(err, salt) {
            bcrypt.hash(password, salt, async function(err, hash) {
                try {
                    // adding a new user to the database
                    const newUser = await pool.query(
                        `
                        INSERT INTO users (uuid, role, email, username, firstname, lastname, password, code) 
                        VALUES($1, $2, $3, $4, $5, $6, $7, $8) 
                        RETURNING *
                        `, [uuidv4(), "temp_user", email, username, firstname, lastname, hash, 44654]
                    )
                    console.log(newUser.rows);
                    res.json(newUser.rows[0]);
                } catch (err) {
                    res.render("response.njk", {user: req.session.user, title: "Sign Up Error", link: "/sign-up", message: "Error: " + err, buttonMsg: "BACK TO SIGN UP PAGE"});
                }
            });
        });
    } catch (err) {
        console.error(err.message);
    }
});

server.get("/giftList", urlencodedParser, async (req, res) => {
    try {
        const giftList = await pool.query(
            `
            SELECT giftlist
            FROM users
            WHERE email = $1
            `, ["closcastillo95@gmail.com"]
        )
        // console.log(giftList.rows[0]["giftlist"][0])
        let giftlist = giftList.rows[0]["giftlist"]
        console.log(giftlist)
        res.json(giftlist)
    } catch (error) {
        res.json(error)
    }
});

server.post("/add-gift", urlencodedParser, async (req, res) => {
    const newGift = req.body;
    try {
        const giftList = await pool.query(
        `
        UPDATE users 
        SET giftlist = COALESCE(giftlist, '[]'::jsonb) || $1::jsonb
        WHERE email = $2;
        `, [newGift, "closcastillo95@gmail.com"]
        )
        // `
        // UPDATE users 
        // SET giftList = giftList || $1::jsonb
        // WHERE email = $2;
        // `, [newGift, "closcastillo95@gmail.com"]
        // `
        // UPDATE users 
        // SET giftList = COALESCE(giftList, '[]'::jsonb) || $1::jsonb
        // WHERE email = $2;
        // `, [newGift, "closcastillo95@gmail.com"]
        res.json(giftList)
    } catch (error) {
        res.json(error)
    }
});

server.post("/delete-gift", urlencodedParser, async (req, res) => {
    const {index} = req.body;
    try {
        const giftList = await pool.query(
        `
        UPDATE users
        SET giftlist = giftlist - $1::integer
        WHERE email = $2
        `, [index, "closcastillo95@gmail.com"]
        )
        
        res.json(giftList)
    } catch (error) {
        res.json(error)
    }
});

server.patch("/change", urlencodedParser, async (req, res) => {
    const {index, ...itemNum} = req.body;
    console.log(itemNum)

    try {
        let dbResult = await pool.query(
            `
            SELECT giftlist
            FROM users
            WHERE email = $1
            `, ["closcastillo95@gmail.com"]
        );

        let giftlist = dbResult.rows[0]["giftlist"];
        giftlist[parseInt(index)] = itemNum;

        dbResult = await pool.query(
            `
            UPDATE users
            SET giftlist = $1::jsonb
            WHERE email = $2
            `, [JSON.stringify(giftlist), "closcastillo95@gmail.com"]
        );
        res.json(giftlist)
    } catch (error) {
        res.json(error)
    }
});