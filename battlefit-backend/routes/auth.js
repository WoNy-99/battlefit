import express from "express";
import multer from "multer";
import path from "path";
import bcrypt from "bcrypt";
import db from "../db.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// 이미지 저장 설정
const storage = multer.diskStorage({
    destination: "uploads/profile/",
    filename: (req, file, cb) => {
        const unique = Date.now() + path.extname(file.originalname);
        cb(null, unique);
    }
});
const upload = multer({ storage });

// 회원가입
router.post("/register", upload.single("profile_img"), async (req, res) => {
    try {
        const { username, password, name, favorite_tags } = req.body;

        if (!username || !password || !name) {
            return res.status(400).json({ error: "Missing fields" });
        }

        const hashed = await bcrypt.hash(password, 10);
        const profile_url = req.file ? `/uploads/profile/${req.file.filename}` : null;

        await db.execute(
            "INSERT INTO users (username, password, name, profile_img, favorite_tags) VALUES (?, ?, ?, ?, ?)",
            [username, hashed, name, profile_url, favorite_tags]
        );

        res.json({ success: true });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Register failed", message: err.message });
    }
});

// 로그인
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        const [rows] = await db.execute(
            "SELECT * FROM users WHERE username = ?",
            [username]
        );

        if (rows.length === 0)
            return res.status(400).json({ error: "User not found" });

        const user = rows[0];

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ error: "Wrong password" });

        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                username: user.username,
                name: user.name,
                profile_img: user.profile_img,
                favorite_tags: user.favorite_tags
            }
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Login failed" });
    }
});
router.post("/login", async (req, res) => {
    try {
        console.log("📩 [백엔드] 로그인 요청 도착:", req.body);

        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Missing fields" });
        }

        const [rows] = await db.execute(
            "SELECT * FROM users WHERE username = ?",
            [username]
        );

        if (rows.length === 0)
            return res.status(400).json({ error: "User not found" });

        const user = rows[0];

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ error: "Wrong password" });

        res.json({ success: true, user });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Login failed" });
    }
});


// 🔥 반드시 마지막 줄에 export
export default router;
