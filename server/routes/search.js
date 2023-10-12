const express = require("express");
const router = express.Router();
const pool = require("../db");
module.exports = router;

// 入力条件に適したdigを取得
router.get('/dig', (req, res) => {
    const { userId = null, artist = null, title = null, domain = null } = req.query;
    const params = [];
    let query = "select * from digs";
    if (userId || artist || title || domain) {
        query += " where";
        if (userId) {
            params.push(userId);
            query += " user_id = $" + params.length;
        }
        if (artist) {
            query += " artist like "+ "'%" + artist + "%'";
        }
        if (title) {
            query += " title like $" + "'%" + title + "%'";
        }
        if (domain) {
            params.push(domain);
            query += " domain = $" + params.length;
        }
    }
    console.log(query, params)
    pool.query(query, params, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result.rows);
        }
    });
});