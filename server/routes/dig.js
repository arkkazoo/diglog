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
    pool.query(statement[0], statement[1], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result.rows);
        }
    });
}
);

// digの投稿
router.post('/', async (req, res) => {
    const { url, artist, title, tags } = req.body;
    const jwtToken = req.headers.authorization;
    const decoded = JWT.verify(jwtToken, process.env.JWT_SECRET);
    if (!decoded) {
        return res.send("invalid token");
    }
    user_id = decoded.user_id;
    // URLからドメインを判定
    const domain = identifyDomain(url);
    if (domain === null) {
        return res.status(400).json({ message: "invalid domain. url:" + url })
    }
    const { rows: digRows } = await pool.query("insert into digs (user_id, url, domain, artist, title) values ($1, $2, $3, $4, $5) returning dig_id", [user_id, url, domain, artist, title]);
    if (!digRows) {
        return res.status(400).json({ message: "failed to insert dig" });
    }
    if (tags) {
        for (let index = 0; index < tags.length; index++) {
            const tag = tags[index];

            // タグのクエリを実行
            const { rows: tagRows } = await pool.query("insert into tags (tag_name) values ($1) on conflict (tag_name) do update set tag_name = $1 returning tag_id", [tag]);
            if (!tagRows) {
                return res.status(400).json({ message: "failed to insert tag" });
            }

            // digs_tagsのクエリを実行
            pool.query("insert into digs_tags (dig_id, tag_index, tag_id) values ($1, $2, $3)", [digRows[0].dig_id, index, tagRows[0].tag_id], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(400).json({ message: "failed to insert digs_tags" });
                }
            }
            );
        }
    }
    console.log("dig.post", digRows[0].dig_id);
    res.status(200).json({ message: "success" });
});

// digの更新
router.put('/', async (req, res) => {
    const { dig_id, url, artist, title, tags } = req.body;

    const jwtToken = req.headers.authorization
    const decoded = JWT.verify(jwtToken, process.env.JWT_SECRET);
    if (!decoded) {
        return res.status(400).json({ message: "invalid token" });
    }
    const user_id = decoded.user_id;

    const domain = identifyDomain(url);
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
    const result = await pool.query("delete from digs_tags where dig_id = $1", [dig_id]);

    // digs_tagsの挿入
    if (tags) {
        for (let index = 0; index < tags.length; index++) {
            const tag = tags[index];

            // タグのクエリを実行
            const { rows: tagRows } = await pool.query("insert into tags (tag_name) values ($1) on conflict (tag_name) do update set tag_name = $1 returning tag_id", [tag]);
            if (!tagRows) {
                return res.status(400).json({ message: "failed to insert tag" });
            }

            // digs_tagsのクエリを実行
            pool.query("insert into digs_tags (dig_id, tag_index, tag_id) values ($1, $2, $3)", [dig_id, index, tagRows[0].tag_id], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(400).json({ message: "failed to insert digs_tags" });
                }
            });
        }
        console.log("dig.put", dig_id);
        return res.status(200).json({ message: "success" });
    }
});

// digの削除
router.delete('/', (req, res) => {
    const dig_id = req.body.dig_id;
    const jwtToken = req.headers.authorization
    const decoded = JWT.verify(jwtToken, process.env.JWT_SECRET);
    if (!decoded) {
        return res.status(400).json({ message: "invalid token" });
    }
    const user_id = decoded.user_id;

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
                        console.log(err);
                    }
                });
                console.log("dig.delete", dig_id);
                res.status(200).json({ message: "deleted" });
            } else {
                res.status(400).json({ message: "error: dig.delete 2" });
            }
        }
    });
});

// random digの取得
router.get('/random', async (req, res) => {
    let user_id;
    // ログインしていない場合はuser_idを0にする
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
        return res.status(200).json(data.rows[0]);
    } catch (err) {
        console.log(err)
        return res.status(400).json({ message: "failed to select dig" });
    }
});