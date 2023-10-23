const express = require("express");
const router = express.Router();
const pool = require("../db");
const JWT = require("jsonwebtoken");
module.exports = router;


router.get('/', async (req, res) => {

    const { userId = null, playlist_name = null, playlistId = null } = req.query;
    const offset = req.query.offset || 0;
    const limit = req.query.limit || 20;
    let parameters_index = 1;
    const params = [];

    let statement = 'select * from playlists where 1=1 ';
    if (userId) {
        statement += ` and user_id = $${parameters_index++}`;
        params.push(userId);
    }
    if (playlist_name) {
        statement += ` and playlist_name like $${parameters_index++}`;
        params.push(playlist_name);
    }
    if (playlistId) {
        statement += ` and playlist_id = $${parameters_index++}`;
        params.push(playlistId);
    }

    statement += ` order by created_at desc limit $${parameters_index++} offset $${parameters_index++}`;
    params.push(limit);
    params.push(offset);

    try {
        const playlists = await pool.query(statement, params);
        res.send(playlists.rows);
    } catch (err) {
        console.log(err)
    }
});


router.get('/digs/', async (req, res) => {

    const { userId = null, playlist_name = null, playlistId } = req.query;
    const offset = req.query.offset || 0;
    const limit = req.query.limit || 20;
    let parameters_index = 1;
    const params = [];

    let statement = 'select * from playlists where 1=1';

    if (userId) {
        statement += ` and user_id = $${parameters_index++}`;
        params.push(userId);
    }
    if (playlist_name) {
        statement += ` and playlist_name like $${parameters_index++}`;
        params.push(playlist_name);
    }
    if (playlistId) {
        statement += ` and playlist_id = $${parameters_index++}`;
        params.push(playlistId);
    }

    statement += ` order by created_at desc limit $${parameters_index++} offset $${parameters_index++}`;
    params.push(limit);
    params.push(offset);

    try {
        const playlists = await pool.query(statement, params);

        // 各プレイリストに含まれるdigを取得
        await Promise.all(playlists.rows.map(async (playlist, index) => {
            let statement = 'select'
                + ' digs.dig_id, digs.user_id, digs.artist, digs.title, digs.domain, digs.url'
                + ' from playlists_digs left join digs on playlists_digs.dig_id = digs.dig_id'
                + ' where playlists_digs.playlist_id = $1 order by playlists_digs.playlist_index';

            const digs = await pool.query(statement, [playlist.playlist_id]);

            playlists.rows[index].digs = digs.rows;
        }));

        res.send(playlists.rows);

    } catch (err) {
        console.log(err)
    }
});


//dプレイリストへのdigの追加
router.post('/digs/', async (req, res) => {

    const { playlist_id, dig_id } = req.body;
    const jwtToken = req.headers.authorization;
    let user_id;

    try {
        const decoded = JWT.verify(jwtToken, process.env.JWT_SECRET);
        if (!decoded) {
            return res.send("invalid token");
        }
        user_id = decoded.user_id;

    } catch (err) {
        console.log(err)
    }

    // user_idの照合
    try {
        const result = await pool.query("select * from playlists where playlist_id = $1 and user_id = $2", [playlist_id, user_id]);

        if (result.rows.length === 0) {
            return res.status(400).send({ success: false, message: "invalid user_id" });
        }

    } catch (err) {
        console.log(err);
        return res.status(400).send({ success: false, message: "failed" });
    }

    // playlistの最後尾に追加
    try {
        const result = await pool.query("select max(playlist_index) from playlists_digs where playlist_id = $1", [playlist_id]);

        const playlist_index = result.rows[0].max + 1;

        await pool.query("insert into playlists_digs (playlist_id, dig_id, playlist_index) values ($1, $2, $3)", [playlist_id, dig_id, playlist_index]);

        res.status(201).send({ success: true, message: "created" });

    } catch (err) {
        console.log(err);
        res.status(400).send({ success: false, message: "failed" });
    }
});


router.post('/', async (req, res) => {

    const { playlist_name } = req.body;
    let user_id

    try {
        const jwtToken = req.headers.authorization;
        const decoded = JWT.verify(jwtToken, process.env.JWT_SECRET);
        if (!decoded) {
            return res.send("invalid token");
        }
        user_id = decoded.user_id;

    } catch (err) {
        console.log(err);
        return res.status(400).send({ success: false, message: "invalid token" });
    }

    try {
        await pool.query("insert into playlists (user_id, playlist_name) values ($1, $2) returning *", [user_id, playlist_name]);
        res.status(201).send({ success: true, message: "created" });

    } catch (err) {
        console.log(err);
        res.status(400).send({ success: false, message: "failed" });
    }
});


router.put('/', async (req, res) => {

    const { playlist_name, playlist_id, dig_ids } = req.body;
    let user_id;

    try {
        const jwtToken = req.headers.authorization;
        const decoded = JWT.verify(jwtToken, process.env.JWT_SECRET);
        if (!decoded) {
            return res.send("invalid token");
        }
        user_id = decoded.user_id;

    } catch (err) {
        console.log(err);
        return res.status(400).send({ success: false, message: "invalid token" });
    }

    // user_idの照合
    try {
        const result = await pool.query("select * from playlists where playlist_id = $1 and user_id = $2", [playlist_id, user_id]);

        if (result.rows.length === 0) {
            return res.status(400).send({ success: false, message: "invalid user_id" });
        }

        await pool.query("update playlists set playlist_name = $1 where playlist_id = $2", [playlist_name, playlist_id]);

        await pool.query("delete from playlists_digs where playlist_id = $1", [playlist_id]);

        await Promise.all(dig_ids.map(async (dig_id, index) => {
            await pool.query("insert into playlists_digs (playlist_id, dig_id, playlist_index) values ($1, $2, $3)", [playlist_id, dig_id, index]);
        }));

        res.status(201).send({ success: true, message: "updated" });

    } catch (err) {
        console.log(err);
        res.status(400).send({ success: false, message: "failed" });
    }
});

router.delete('/', async (req, res) => {

    let user_id;
    const { playlist_id } = req.body;
    const jwtToken = req.headers.authorization;

    try {
        const decoded = JWT.verify(jwtToken, process.env.JWT_SECRET);
        if (!decoded) {
            res.status(400).send({ success: false, message: "invalid token" });
        }
        user_id = decoded.user_id;

    } catch (err) {
        console.log(err);
        res.status(400).send({ success: false, message: "failed" });
    }

    try {
        await pool.query("delete from playlists where playlist_id = $1 and user_id = $2", [playlist_id, user_id]);
        await pool.query("delete from playlists_digs where playlist_id = $1", [playlist_id]);
        res.status(200).send({ success: true, message: "deleted" });

    } catch (err) {
        console.log(err);
        res.status(400).send({ success: false, message: "failed" });
    }
});