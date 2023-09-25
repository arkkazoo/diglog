const express = require("express");
const router = express.Router();
const pool = require("../db");
module.exports = router;

// ユーザーの取得
router.get('/:username', (req, res) => {
    const username = req.params.username;
    pool.query("select * from users where username = $1", [username], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            // display_nameを返す
            console.log(result.rows[0].display_name);
            res.send(result.rows[0].display_name);
        }
    });
});

// ユーザーの登録
router.post('/', async (req, res) => {
    const { username, password, email, displayName } = req.body;
    // ユーザー名とパスワードが入力されているかチェック
    if (!username || !password) {
        return res.status(401).send("ユーザー名とパスワードを入力してください");
    }
    // ユーザー名が既に登録されていないかチェック
    const checkUsername = await pool.query("select * from users where username = $1", [username]);
    if (checkUsername.rows.length > 0) {
        return res.status(401).send("既に登録されているユーザー名です");
    }
    // オプションで登録するカラムを指定
    const columns = [];
    const values = [];
    if (email) {
        columns.push("email");
        values.push(email);
    }
    if (displayName) {
        columns.push("display_name");
        values.push(displayName);
    }
    // ユーザーを登録
    pool.query("insert into users (username, password, " + columns.join(", ") + ") values ($1, $2, " + values.map((value, index) => "$" + (index + 3)).join(", ") + ")", [username, password, ...values], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(username + "を登録しました")
            res.send(username + "を登録しました");
        }
    });
});


// ユーザーの更新
router.put('/', async (req, res) => {
    let { username, password, email, displayName, newUsername, newPassword } = req.body;
    //更新するユーザーとパスワードが適正かチェック
    const checkPassword = await pool.query("select * from users where username = $1 and password = $2", [username, password]);
    //適正でない場合はエラーを返す
    if (checkPassword.rows.length === 0) {
        return res.status(401).send("ユーザーネームとパスワードが一致しません");
    }
    //更新するカラムを指定
    const updateColumns = [];
    if (email) {
        updateColumns.push("email = " + "'" + email + "'");
    }
    if (displayName) {
        updateColumns.push("display_name = " + "'" + displayName + "'");
    }
    if (newUsername) {
        //新しいユーザー名が既に使われていないかチェック
        const checkUsername = await pool.query("select * from users where username = $1", [newUsername]);
        if (checkUsername.rows.length > 0) {
            return res.status(402).send("既に登録されているユーザー名です");
        }
        updateColumns.push("username = " + "'" + newUsername + "'");
    }
    if (newPassword) {
        updateColumns.push("password = " + "'" + newPassword + "'");
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
    pool.query("delete from users where username = $1 and password = $2", [username, password], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(username + "を削除しました")
            res.send(username + "を削除しました");
        }
    });
});
