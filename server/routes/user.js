const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
module.exports = router;
JWT = require("jsonwebtoken");

// JWTトークンでユーザー名を取得
router.get('/', (req, res) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ message: "トークンがありません" });
    }
    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    pool.query("select * from users where username = $1", [decoded.username], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ message: "ユーザーの取得に失敗しました" });
        } else {
            res.status(201).json(result.rows[0].username);
        }
    });
});

// ユーザーの登録
router.post('/', async (req, res) => {
    const { username, password } = req.body;
    // ユーザー名が既に登録されていないかチェック
    const checkUsername = await pool.query("select * from users where username = $1", [username]);
    if (checkUsername.rows.length > 0) {
        return res.status(401).json({ message: "ユーザー名が既に登録されています" });
    }
    // パスワードをハッシュ化
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
            // 登録が成功したらsuccessを返す
            const response = {
                status: "success",
            }
            res.status(201).json(response);
        }
    });
});


// ユーザーの更新
router.put('/', async (req, res) => {
    let { username, password, newUsername, newPassword } = req.body;
    //hashed_passwordを取得
    const hashedPassword = await pool.query("select hashed_password from users where username = $1", [username]);
    //パスワードが一致するかチェック
    const checkPassword = await bcrypt.compare(password, hashedPassword.rows[0].hashed_password);
    if (!checkPassword) {
        return res.status(401).send("パスワードが一致しません");
    }
    //更新するカラムを指定
    const updateColumns = [];
    if (newUsername) {
        //新しいユーザー名が既に使われていないかチェック
        const checkUsername = await pool.query("select * from users where username = $1", [newUsername]);
        if (checkUsername.rows.length > 0) {
            return res.status(402).send("既に登録されているユーザー名です");
        }
        updateColumns.push("username = " + "'" + newUsername + "'");
    }
    if (newPassword) {
        //新しいパスワードをハッシュ化
        newPassword = await bcrypt.hash(newPassword, 10);
        updateColumns.push("hashed_password = " + "'" + newPassword + "'");
    }
    //更新するカラムがない場合はエラー
    if (updateColumns.length === 0) {
        res.status(400).send("Bad Request");
        return;
    }
    //更新
    pool.query(`update users set ${updateColumns.join(", ")} where username = $1 and password = $2`, [username, password], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(username + "を更新しました");
            res.send(username + "を更新しました");
        }
    });
});


// ユーザーの削除
router.delete('/', (req, res) => {
    const { username, password } = req.body;
    //DBからハッシュ化されたパスワードを取得
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
    pool.query("delete from users where username = $1", [username], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(username + "を削除しました")
            res.send(username + "を削除しました");
        }
    });
});
