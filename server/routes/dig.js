const express = require("express");
const router = express.Router();
const pool = require("../db");
const identifyDomain = require("../src/util");
const JWT = require("jsonwebtoken");
module.exports = router;

// digの取得
router.get('/', (req, res) => {
    const user_id = req.query.user_id;
    if (user_id) {
        pool.query("select * from digs where user_id = $1", [user_id], (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result.rows);
            }
        });
    } else {
        pool.query("select * from digs", (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result.rows);
            }
        });
    }
});

// digの投稿
router.post('/', (req, res) => {
    const { url, artist, title, comment } = req.body;
    const jwtToken = req.headers.authorization;
    const decoded = JWT.verify(jwtToken, process.env.JWT_SECRET);
    if (!decoded) {
        return res.send("invalid token");
    }
    user_id = decoded.user_id;
    // URLからドメインを判定
    const domain = identifyDomain(url);
    if (!domain) {
        return res.send("invalid domain. url:" + url);
    }
    pool.query("insert into digs (user_id, url, domain, artist, title, comment) values ($1, $2, $3, $4, $5, $6)", [user_id, url, domain, artist, title, comment], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result.rows);
        }
    });
});

// digの更新
router.put('/', (req, res) => {
    const { dig_id, url, artist, title, comment } = req.body;
    // URLからドメインを判定
    const domain = identifyDomain(url);
    if (!domain) {
        return res.send("invalid domain. url:" + url);
    }
    pool.query("update digs set url = $1, domain = $2, artist = $3, title = $4, comment = $5, updated_at = current_timestamp where dig_id = $6", [url, domain, artist, title, comment, dig_id], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result.rows);
        }
    });
});

// digの削除
router.delete('/:dig_id', (req, res) => {
    const { post_id } = req.params;
    pool.query("delete from digs where dig_id = $1", [post_id], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result.rows);
        }
    });
});
