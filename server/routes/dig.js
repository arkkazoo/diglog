const express = require("express");
const router = express.Router();
const pool = require("../db");
const identifyDomain = require("../src/util");
const JWT = require("jsonwebtoken");
module.exports = router;


// digの取得
router.get('/', async (req, res) => {

    const offset = req.query.offset || 0;
    const limit = req.query.limit || 20;
    const user_id = req.query.userId;

    console.log("INFO: DIG GET REQUESTED query:" + req.query);

    let statement;

    if (user_id) {
        statement = [
            "select"
            + " digs.dig_id, digs.user_id, digs.url, digs.domain, digs.artist, digs.title, array_agg(tags.tag_name) AS tags, digs.created_at"
            + " from digs"
            + " left join digs_tags on digs.dig_id = digs_tags.dig_id"
            + " left join tags on digs_tags.tag_id = tags.tag_id"
            + " where digs.user_id = $1"
            + " group by digs.dig_id, digs.user_id, digs.url, digs.domain, digs.artist, digs.title, digs.created_at"
            + " order by digs.created_at desc limit $2 offset $3"
            , [user_id, limit, offset]];

    } else {
        statement = [
            "select"
            + " digs.dig_id, digs.user_id, digs.url, digs.domain, digs.artist, digs.title, array_agg(tags.tag_name) AS tags, digs.created_at"
            + " from digs"
            + " left join digs_tags on digs.dig_id = digs_tags.dig_id"
            + " left join tags on digs_tags.tag_id = tags.tag_id"
            + " group by digs.dig_id, digs.user_id, digs.url, digs.domain, digs.artist, digs.title, digs.created_at"
            + " order by digs.created_at desc limit $1 offset $2"
            , [limit, offset]];
    }

    try {
        pool.query(statement[0], statement[1], (err, result) => {

            if (err) {
                console.log("ERROR: DIG GET FAILED\n" + err);
            } else {
                console.log("INFO: DIG GET COMPLETED statement:" + statement);
                res.status(200).json(result.rows);
            }

        });

    } catch (err) {
        console.log(err);
        res.status(400).json({ success: false, message: "failed to select dig" });
    }
});


// digの投稿
router.post('/', async (req, res) => {

    const { url, artist, title, tags } = req.body;
    const jwtToken = req.headers.authorization;

    console.log("INFO: DIG POST REQESTED artist:" + artist, "title:" + title, "tags:" + tags, "url:" + url);

    let user_id, domain;

    try {
        const decoded = JWT.verify(jwtToken, process.env.JWT_SECRET);
        if (!decoded) {
            return res.send("invalid token");
        }
        user_id = decoded.user_id;
        console.log("INFO: DIG POST PROCCESSING user_id:" + user_id)

    } catch (err) {
        console.log(err);
        return res.status(400).json({ message: "invalid token" });
    }

    try {
        domain = identifyDomain(url);
        if (domain === null) {
            return res.status(400).json({ message: "invalid domain. url:" + url })
        }

    } catch (err) {
        console.log(err);
        return res.status(400).json({ message: "invalid domain. url:" + url })
    }

    try {
        const { rows: digRows } = await pool.query("insert into digs (user_id, url, domain, artist, title) values ($1, $2, $3, $4, $5) returning dig_id", [user_id, url, domain, artist, title]);

        if (!digRows) {
            return res.status(400).json({ message: "failed to insert dig" });
        }

        if (tags) {
            for (let index = 0; index < tags.length; index++) {
                const tag = tags[index];

                const { rows: tagRows } = await pool.query("insert into tags (tag_name) values ($1) on conflict (tag_name) do update set tag_name = $1 returning tag_id", [tag]);
                if (!tagRows) {
                    return res.status(400).json({ message: "failed to insert tag" });
                }

                pool.query("insert into digs_tags (dig_id, tag_index, tag_id) values ($1, $2, $3)", [digRows[0].dig_id, index, tagRows[0].tag_id], (err, result) => {
                    if (err) {
                        console.log(err);
                        return res.status(400).json({ message: "failed to insert digs_tags" });
                    }
                });
            }
        }

        console.log("INFO: DIG POST COMPLETED", "user_id:" + user_id, "dig_id:" + digRows[0].dig_id, artist, "-", title, tags, url);
        res.status(200).json({ message: "success" });

    } catch (err) {
        console.log("INFO: DIG POST FAILED\n" + err);
        res.status(400).json({ message: "failed to insert dig" });
    }
});


// digの更新
router.put('/', async (req, res) => {

    const { dig_id, url, artist, title, tags } = req.body;
    let user_id, domain;

    try {
        const jwtToken = req.headers.authorization
        const decoded = JWT.verify(jwtToken, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(400).json({ message: "invalid token" });
        }
        user_id = decoded.user_id;

    } catch (err) {
        console.log(err)
        res.status(400).json({ message: "failed to update dig" });
    }

    try {
        domain = identifyDomain(url);
        if (domain === null) {
            return res.send("invalid domain. url:" + url);
        }

        // user_idとdig_idを照合
        const { rows: digRows } = await pool.query("select * from digs where dig_id = $1 and user_id = $2", [dig_id, user_id]);
        if (!digRows) {
            return res.status(400).json({ message: "failed to select dig" });
        }
        if (digRows.length === 0) {
            return res.status(400).json({ message: "no dig found" });
        }

        // digsのクエリを実行
        pool.query("update digs set url = $1, domain = $2, artist = $3, title = $4 where dig_id = $5", [url, domain, artist, title, dig_id], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(400).json({ message: "failed to update dig" });
            }
        });

        // digs_tagsの削除
        await pool.query("delete from digs_tags where dig_id = $1", [dig_id]);

        // digs_tagsの挿入
        if (tags) {
            for (let index = 0; index < tags.length; index++) {
                const tag = tags[index];

                const { rows: tagRows } = await pool.query("insert into tags (tag_name) values ($1) on conflict (tag_name) do update set tag_name = $1 returning tag_id", [tag]);
                if (!tagRows) {
                    return res.status(400).json({ message: "failed to insert tag" });
                }

                pool.query("insert into digs_tags (dig_id, tag_index, tag_id) values ($1, $2, $3)", [dig_id, index, tagRows[0].tag_id], (err, result) => {
                    if (err) {
                        console.log(err);
                        return res.status(400).json({ message: "failed to insert digs_tags" });
                    }
                });
            }

            console.log("INFO: DIG PUT COMPLETED dig_id" + dig_id, "");
            return res.status(200).json({ message: "success" });
        }

    } catch (err) {
        console.log("ERROR: DIG PUT FAILED\n", err)
    }
});


// digの削除
router.delete('/', (req, res) => {

    const dig_id = req.body.dig_id;
    let user_id;
    console.log("INFO: DIG DELETE REQUESTED dig_id:" + dig_id);

    try {
        const jwtToken = req.headers.authorization
        const decoded = JWT.verify(jwtToken, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(400).json({ message: "invalid token" });
        }
        user_id = decoded.user_id;

    } catch (err) {
        console.log(err)
    }

    try {
        pool.query("delete from digs where dig_id = $1 and user_id = $2", [dig_id, user_id], (err, result) => {

            if (err) {
                console.log('error from delete dig')
                console.log(err);
                res.status(400).json({ message: "error: dig.delete 1" });

            } else {
                if (result.rowCount > 0) {
                    // digs_tagsの削除
                    pool.query("delete from digs_tags where dig_id = $1", [dig_id], (err, result) => {
                        if (err) {
                            console.log("ERROR: DIG DELETE at digs_tags\n", err);

                        } else {
                            console.log("INFO: DIG DELETE COMPLETED dig_id:" + dig_id, "user_id" + user_id);
                            res.status(200).json({ message: "deleted" });
                        }
                    });

                } else {

                    res.status(400).json({ message: "error: dig.delete" });
                }
            }
        });

    } catch (err) {
        console.log("ERROR: DIG DELETE FAILED\n", err)
    }
});


// random digの取得
router.get('/random', async (req, res) => {

    let user_id;

    console.log("INFO: DIG RANDOM REQUESTED")

    // ログインしていない場合はuser_idを0にして全ユーザーのdigを対象にする
    if (!req.headers.authorization || req.authorization === "" || req.headers.authorization === "undefined") {
        user_id = 0;

    } else {
        const jwtToken = req.headers.authorization
        try {
            const decoded = JWT.verify(jwtToken, process.env.JWT_SECRET);
            user_id = decoded.user_id;

        } catch (err) {
            console.log(err)
            user_id = 0;
        }
    }

    try {
        const data = await pool.query("select * from digs where user_id != $1 order by random() limit 1", [user_id]);

        if (data.rows.length === 0) {
            return res.status(400).json({ message: "no dig found" });
        }

        const dig = data.rows[0];
        console.log("INFO: DIG RANDOM COMPLETED user_id:" + user_id, "dig_id:" + dig.dig_id, dig.artist, dig.title, dig.url)
        return res.status(200).json(data.rows[0]);

    } catch (err) {
        console.log("ERROR: DIG RANDOM FAILED\n", err)
        return res.status(400).json({ message: "failed to select dig" });
    }
});