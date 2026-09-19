// routes/comments.js
import express from "express";
import db from "../db.js";
import jwt from "jsonwebtoken";

const router = express.Router();

/* -----------------------------
   JWT 인증 미들웨어
------------------------------ */
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "No token" });

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { id, username }
        next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid token" });
    }
}

/* -----------------------------
   댓글 목록 조회 (GET)
   /comments/:post_id
------------------------------ */
router.get("/:post_id", async (req, res) => {
    const { post_id } = req.params;

    try {
        const [rows] = await db.execute(
            `SELECT c.id, c.content, c.created_at,
                    u.name AS username, u.profile_img
             FROM comments c
             JOIN users u ON c.user_id = u.id
             WHERE c.post_id = ?
             ORDER BY c.created_at ASC`,
            [post_id]
        );

        res.json(rows);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to fetch comments" });
    }
});

/* -----------------------------
   댓글 작성 (POST)
   /comments/:post_id
------------------------------ */
router.post("/:post_id", authMiddleware, async (req, res) => {
    const { post_id } = req.params;
    const { content, user_id } = req.body;

    if (!content) return res.status(400).json({ error: "content is required" });

    try {
        await db.execute(
            `INSERT INTO comments (post_id, user_id, content)
             VALUES (?, ?, ?)`,
            [post_id, user_id, content]
        );

        res.json({ success: true });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to insert comment" });
    }
});

export default router;
