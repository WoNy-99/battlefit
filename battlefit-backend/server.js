import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/auth.js";
import postsRouter from "./routes/posts.js";
import commentRouter from "./routes/comments.js";
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// 정적 이미지 제공
app.use("/uploads", express.static("uploads"));

app.use("/auth", authRouter);
app.use("/posts", postsRouter);
app.use("/comments", commentRouter);
app.listen(process.env.PORT, () => {
    console.log("🚀 Server running on port", process.env.PORT);
});
