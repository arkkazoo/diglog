const express = require("express");
const router = express.Router();
const pool = require("../../db");
const identifyDomain = require("../../src/util");
module.exports = router;

// digの投稿
router.post('/', async (req, res) => {

    const { user_id, url, artist, title, tags } = req.body;
    const apiToken = req.headers['x-api-key'];

    if (apiToken !== process.env.API_KEY_EXTERNAL) {
        return res.status(400).json({ message: "invalid token" })
    }

    console.log("INFO: SNAPLINK DIG POST REQESTED artist:" + artist, "title:" + title, "tags:" + tags, "url:" + url);

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

        console.log("INFO: SNAPLINK DIG POST COMPLETED", "user_id:" + user_id, "dig_id:" + digRows[0].dig_id, artist, "-", title, tags, url);
        res.status(200).json({ message: "success" });

    } catch (err) {
        console.log("INFO: SNAPLINK DIG POST FAILED\n" + err);
        res.status(400).json({ message: "failed to insert dig" });
    }
});
