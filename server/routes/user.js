const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
module.exports = router;
JWT = require("jsonwebtoken");


router.get('/', (req, res) => {

    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: "トークンがありません" });
    }

    try {
        const decoded = JWT.verify(token, process.env.JWT_SECRET);

        pool.query("select * from users where username = $1", [decoded.username], (err, result) => {

            if (err) {
                console.log(err);
                res.status(500).json({ message: "ユーザーの取得に失敗しました" });

            } else {
                res.status(201).json(result.rows[0].username);
            }
        });

    } catch (err) {
        console.log(err)
    }
});


// ユーザーの登録
router.post('/', async (req, res) => {

    const { username, password } = req.body;

    // ユーザー名の重複禁止
    try {
        const checkUsername = await pool.query("select * from users where username = $1", [username]);

        if (checkUsername.rows.length > 0) {
            return res.status(401).json({ message: "ユーザー名が既に登録されています" });
        }
    } catch (err) {
        console.log(err)
    }


    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        pool.query("insert into users (username, hashed_password) values ($1, $2)", [username, hashedPassword], (err, result) => {

            if (err) {
                console.log(err);
                const response = {
                    message: "ユーザーの登録に失敗しました"
                }
                res.status(500).json(response);

            } else {
                console.log(username + "を登録しました")
                res.status(201).json({ status: "success" });
            }
        });

    } catch (err) {
        console.log(err)
    }
});


router.put('/', async (req, res) => {

    let { username, password, newUsername, newPassword } = req.body;

    try {
        const hashedPassword = await pool.query("select hashed_password from users where username = $1", [username]);

        const checkPassword = await bcrypt.compare(password, hashedPassword.rows[0].hashed_password);

        if (!checkPassword) {
            return res.status(401).send("パスワードが一致しません");
        }

    } catch (err) {
        console.log(err)
    }

    const updateColumns = [];

    if (newUsername) {

        try {
            const checkUsername = await pool.query("select * from users where username = $1", [newUsername]);
            if (checkUsername.rows.length > 0) {
                return res.status(402).send("既に登録されているユーザー名です");
            }
            updateColumns.push("username = " + "'" + newUsername + "'");

        } catch (err) {
            console.log(err)
        }
    }

    if (newPassword) {

        try {
            newPassword = await bcrypt.hash(newPassword, 10);
            updateColumns.push("hashed_password = " + "'" + newPassword + "'");

        } catch (err) {
            console.log(err)
        }
    }

    if (updateColumns.length === 0) {
        res.status(400).send("Bad Request");
        return;
    }

    try {
        pool.query(`update users set ${updateColumns.join(", ")} where username = $1 and password = $2`, [username, password], (err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log(username + "を更新しました");
                res.send(username + "を更新しました");
            }
        });

    } catch (err) {
        console.log(err)
    }
});


router.delete('/', (req, res) => {

    const { username, password } = req.body;

    try {
        pool.query("select hashed_password from users where username = $1", [username], async (err, result) => {
            if (err) {
                console.log(err);
            } else {
                //パスワードが一致するかチェック
                const hashedPassword = result.rows[0].hashed_password;
                const checkPassword = await bcrypt.compare(password, hashedPassword);
                if (!checkPassword) {
                    return res.status(401).send("パスワードが一致しません");
                }
            }
        });

    } catch (err) {
        console.log(err)
    }

    try {
        pool.query("delete from users where username = $1", [username], (err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log(username + "を削除しました")
                res.send(username + "を削除しました");
            }
        });

    } catch (err) {
        console.log(err)
    }
});
