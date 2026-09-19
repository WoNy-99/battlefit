-- =========================================
-- 🚀 BattleFit Database (Final Schema)
-- =========================================

DROP DATABASE IF EXISTS battlefit;
CREATE DATABASE battlefit;
USE battlefit;

-- =========================================
-- 1) Users
-- =========================================
CREATE TABLE users (
                       id INT AUTO_INCREMENT PRIMARY KEY,
                       username VARCHAR(50) NOT NULL UNIQUE,   -- 로그인 아이디
                       password VARCHAR(255) NOT NULL,         -- 해싱된 비밀번호
                       name VARCHAR(50) NOT NULL,              -- 닉네임
                       profile_img VARCHAR(255),               -- 프로필 이미지 URL
                       favorite_tags VARCHAR(255),             -- 좋아하는 운동 태그
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- 2) Posts
-- =========================================
CREATE TABLE posts (
                       id INT AUTO_INCREMENT PRIMARY KEY,
                       user_id INT NOT NULL,
                       text TEXT,                        -- 게시물 내용
                       exercise_type VARCHAR(50),        -- 운동 종류
                       duration VARCHAR(50),             -- 운동 시간
                       image_url VARCHAR(255),           -- 업로드 이미지 URL
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       FOREIGN KEY (user_id) REFERENCES users(id)
);

-- =========================================
-- 3) Comments
-- =========================================
CREATE TABLE comments (
                          id INT AUTO_INCREMENT PRIMARY KEY,
                          post_id INT NOT NULL,
                          user_id INT NOT NULL,
                          content TEXT NOT NULL,
                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                          FOREIGN KEY (post_id) REFERENCES posts(id),
                          FOREIGN KEY (user_id) REFERENCES users(id)
);

-- =========================================
-- 4) Likes (Post 좋아요)
-- =========================================
CREATE TABLE likes (
                       id INT AUTO_INCREMENT PRIMARY KEY,
                       post_id INT NOT NULL,
                       user_id INT NOT NULL,
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       UNIQUE KEY unique_like (post_id, user_id),
                       FOREIGN KEY (post_id) REFERENCES posts(id),
                       FOREIGN KEY (user_id) REFERENCES users(id)
);
