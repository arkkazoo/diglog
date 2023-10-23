const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
require('dotenv').config();
module.exports = router;


router.post('/', (req, res) => {

    const { username, password } = req.body;
    
    try {
        pool.query("select * from users where username = $1", [username], async (err, result) => {

            if (err) {
                console.log(err);
            } else {
                if (result.rows.length === 0) {
                    return res.status(401).json({ message: "ユーザーが存在しません" });
                }

                if (!(await bcrypt.compare(password, result.rows[0].hashed_password))) {
                    return res.status(402).json({ message: "パスワードが一致しません" });
                }
                
                const token = JWT.sign({ user_id: result.rows[0].user_id, username: result.rows[0].username }, process.env.JWT_SECRET);
                const response = {
                    status: "success",
                    token: token,
                    username: result.rows[0].username,
                    userId: result.rows[0].user_id
                }

                res.status(201).json(response);
            }
        });

    } catch (err) {
        console.log(err)
    }
});