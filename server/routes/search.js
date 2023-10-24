const express = require("express");
const router = express.Router();
const pool = require("../db");
module.exports = router;


router.get('/dig', async (req, res) => {

    const q = req.query.q;
    const limit = req.query.limit || 20;
    const offset = req.query.offset || 0;
    
    const searchWords = q.split(' ');

    const tags = searchWords.filter(word => word.startsWith('#')).map(tag => tag.slice(1));

    const keywords = searchWords.filter(word => !word.startsWith('#'));

    // キーワード検索
    let statement = "select"
        + " digs.dig_id, digs.user_id, digs.url, digs.domain, digs.artist, digs.title, array_agg(tags.tag_name) AS tags, digs.created_at"
        + " from digs"
        + " left join digs_tags on digs.dig_id = digs_tags.dig_id"
        + " left join tags on digs_tags.tag_id = tags.tag_id";

    if (keywords.length === 0) {
        statement += " where 1=1";
    } else {
        statement += " where 1=0";
    }

    const params = [];
    let parameters_index = 1;

    // キーワード検索はor likeで検索
    keywords.forEach(keyword => {
        statement += ` or (digs.artist ILIKE $${parameters_index++} or digs.title ILIKE $${parameters_index++})`;
        params.push(`%${keyword}%`);
        params.push(`%${keyword}%`);
    });

    // タグ検索はand 完全一致(大文字小文字は区別しない)で検索
    tags.forEach((tag, index) => {
            console.log("index", index)
            statement += " and digs.dig_id IN (select digs.dig_id from digs left join digs_tags on digs.dig_id = digs_tags.dig_id left join tags on digs_tags.tag_id = tags.tag_id";
            statement += ` where lower(tags.tag_name) = lower($${parameters_index++}))`;
        params.push(`${tag.toLowerCase()}`);
    });

    statement += " group by digs.dig_id, digs.user_id, digs.url, digs.domain, digs.artist, digs.title, digs.created_at"

    // キーワード検索とタグ検索を結合
    statement += ` order by created_at desc limit $${parameters_index++} offset $${parameters_index++}`;

    params.push(limit);
    params.push(offset);

    console.log(q, searchWords, tags, statement, params)

    const digs = await pool.query(statement, params);
    
    res.send(digs.rows);
});