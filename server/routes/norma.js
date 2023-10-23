const express = require("express");
const router = express.Router();
const pool = require("../db");
const JWT = require("jsonwebtoken");
module.exports = router;

// normaの取得
router.get('/', async (req, res) => {
    const jwtToken = req.headers.authorization;
    const decoded = JWT.verify(jwtToken, process.env.JWT_SECRET);
    if (!decoded) {
        return res.send("invalid token");
    }
    user_id = decoded.user_id;

    let normas;
    let daily_norma, weekly_norma, monthly_norma;
    try {
        normas = await pool.query("select * from normas where user_id = $1", [user_id]);
        daily_norma = normas.rows[0].daily_norma
        weekly_norma = normas.rows[0].weekly_norma
        monthly_norma = normas.rows[0].monthly_norma
    } catch (err) {
        console.log(err);
    }
    const json = { daily_norma, weekly_norma, monthly_norma };

    // 今日のdig数、今週のdig数、今月のdig数を取得
    try {
        const daily_dig_count = await pool.query("select count(*) from digs where user_id = $1 and created_at >= current_date", [user_id]);
        const weekly_dig_count = await pool.query("SELECT COUNT(*) FROM digs WHERE user_id = $1"
            + " AND DATE_TRUNC(\'week\', created_at) = DATE_TRUNC(\'week\', CURRENT_DATE)"
            , [user_id]);
        const monthly_dig_count = await pool.query("SELECT COUNT(*) FROM digs WHERE user_id = $1"
            + " AND DATE_TRUNC(\'month\', created_at) = DATE_TRUNC(\'month\', CURRENT_DATE)"
            , [user_id]);

        Promise.all([daily_dig_count, weekly_dig_count, monthly_dig_count]).then(() => {
            json.daily_dig_count = daily_dig_count.rows[0].count;
            json.weekly_dig_count = weekly_dig_count.rows[0].count;
            json.monthly_dig_count = monthly_dig_count.rows[0].count;
            return res.status(200).json(json);
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "internal server error" });
    }
});

// normaの投稿
router.post('/', async (req, res) => {
    const { daily_norma, weekly_norma, monthly_norma } = req.body;
    console.log(req.body)
    const jwtToken = req.headers.authorization;
    const decoded = JWT.verify(jwtToken, process.env.JWT_SECRET);
    if (!decoded) {
        return res.send("invalid token");
    }
    user_id = decoded.user_id;
    // 既にnormaが登録されている場合はアップデート
    const normas = await pool.query("select * from normas where user_id = $1", [user_id]);
    if (normas.rows.length > 0) {
        pool.query("update normas set daily_norma = $1, weekly_norma = $2, monthly_norma = $3 where user_id = $4"
            , [daily_norma, weekly_norma, monthly_norma, user_id]);
        return res.status(200).json({ success:true, message: "norma updated" });
    } else {
        const data = await pool.query("insert into normas (user_id, daily_norma, weekly_norma, monthly_norma) values ($1, $2, $3, $4)"
            , [user_id, daily_norma, weekly_norma, monthly_norma]);

        if (data.rows.length === 0) {
            return res.status(404).json({ message: "norma not found" });
        } else {
            res.status(200).json({ success:true, message: "norma created" });
        }
    }
});

// normaの更新
router.put('/', async (req, res) => {
    const { daily_norma, weekly_norma, monthly_norma } = req.body;
    const jwtToken = req.headers.authorization;
    const decoded = JWT.verify(jwtToken, process.env.JWT_SECRET);
    if (!decoded) {
        return res.send("invalid token");
    }
    user_id = decoded.user_id;
    const data = await pool.query("update normas set daily_norma = $1, weekly_norma = $2, monthly_norma = $3 where user_id = $4 returning *"
        , [daily_norma, weekly_norma, monthly_norma, user_id]);
    if (data.rows.length === 0) {
        return res.status(404).json({ message: "norma not found" });
    } else {
        res.status(200).json({ message: "norma updated" });
    }
});

// normaの削除
router.delete('/', async (req, res) => {
    const jwtToken = req.headers.authorization;
    const decoded = JWT.verify(jwtToken, process.env.JWT_SECRET);
    if (!decoded) {
        return res.send("invalid token");
    }
    user_id = decoded.user_id;
    const data = await pool.query("delete from normas where user_id = $1 returning *", [user_id]);
    if (data.rows.length === 0) {
        return res.status(404).json({ message: "norma not found" });
    } else {
        res.status(204).json({ message: "norma deleted" });
    }
});