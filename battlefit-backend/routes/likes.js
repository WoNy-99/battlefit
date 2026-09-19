import express from "express";
import db from "../db.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// JWT 인증
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader)
        return res.status(401).json({ error: "No token" });

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { id: user_id }
        next();
    } catch {
        res.status(401).json({ error: "Invalid token" });
    }
}

/* -----------------------------------------------------
   🔥 좋아요 토글 API
------------------------------------------------------ */
router.post("/:post_id", authMiddleware, async (req, res) => {
    const { post_id } = req.params;
    const user_id = req.user.id;

    try {
        // 이미 좋아요 눌렀는지 체크
        const [exists] = await db.execute(
            "SELECT * FROM likes WHERE post_id = ? AND user_id = ?",
            [post_id, user_id]
        );

        if (exists.length > 0) {
            // 좋아요 취소
            await db.execute(
                "DELETE FROM likes WHERE post_id = ? AND user_id = ?",
                [post_id, user_id]
            );
            return res.json({ liked: false });
        } else {
            // 좋아요 추가
            await db.execute(
                "INSERT INTO likes (post_id, user_id) VALUES (?, ?)",
                [post_id, user_id]
            );
            return res.json({ liked: true });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to toggle like" });
    }
});

export default router;
