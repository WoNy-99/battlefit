import express from "express";
import multer from "multer";
import path from "path";
import db from "../db.js";
import jwt from "jsonwebtoken";

const router = express.Router();

/* -----------------------------
   1) 이미지 업로드 (multer)
------------------------------ */
const storage = multer.diskStorage({
    destination: "uploads/posts/",
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + "_" + file.originalname;
        cb(null, uniqueName);
    }
});

const upload = multer({ storage });

/* -----------------------------
   2) JWT 인증 미들웨어
------------------------------ */
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: "Not authorized, no token" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "Invalid token format" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { id, username }
        next();
    } catch (err) {
        return res.status(401).json({ error: "Token invalid" });
    }
}

/* -----------------------------
   3) POST /posts — 게시물 생성
------------------------------ */
router.post("/", authMiddleware, upload.single("image"), async (req, res) => {
    try {
        const { text, exercise_type, duration, user_id } = req.body;

        if (!user_id) {
            return res.status(400).json({ error: "user_id is required" });
        }

        const image_url = req.file
            ? `/uploads/posts/${req.file.filename}`
            : null;

        await db.execute(
            `
            INSERT INTO posts (user_id, text, exercise_type, duration, image_url)
            VALUES (?, ?, ?, ?, ?)
            `,
            [user_id, text, exercise_type, duration, image_url]
        );

        res.json({ success: true });
    } catch (err) {
        console.log("Post Create Error:", err);
        res.status(500).json({ error: "Post creation failed" });
    }
});

/* -----------------------------
   4) GET /posts — 전체 게시물 조회
------------------------------ */
router.get("/", async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT 
                p.id,
                p.text,
                p.exercise_type,
                p.duration,
                p.image_url,
                p.created_at,
                u.name AS username,
                u.profile_img,
                (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) AS comment_count,
                (SELECT COUNT(*) FROM likes l WHERE l.post_id = p.id) AS like_count
            FROM posts p
            JOIN users u ON p.user_id = u.id
            ORDER BY p.created_at DESC
        `);

        res.json(rows);
    } catch (err) {
        console.log("Fetch Post Error:", err);
        res.status(500).json({ error: "Fetch failed" });
    }
});

export default router;
