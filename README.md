# BattleFit

운동 기록을 게시하고 다른 사용자와 도전하며 동기를 유지하는 운동 챌린지 SNS 프로젝트입니다.

## 주요 기능

- 회원가입·로그인과 JWT 인증
- 사용자 프로필과 운동 기록 게시물
- 좋아요와 댓글
- 운동 챌린지, 연속 기록, 랭킹으로 확장 가능한 구조

## 기술 스택

- 앱: React Native, Expo
- 서버: Node.js, Express
- 데이터베이스: MySQL

## 담당 내용

- 초기 프로젝트 설계 아이디어 제시
- 백엔드 코드 일부 구현

## 로컬 실행

1. `battlefit-backend/.env.example`을 `.env`로 복사하고 로컬 값을 입력합니다.
2. MySQL에 `battlefit.sql`을 불러옵니다.
3. `battlefit-backend`에서 `npm install`, `npm start`를 실행합니다.
4. `battlefit`에서 `npm install` 후 `EXPO_PUBLIC_API_URL`을 설정하고 Expo를 실행합니다.

## 자료

- [기획 및 발표 자료](https://app.notion.com/p/2b42a28e14f0804a9bdac95c556813c1)
- [구현 데모](https://youtube.com/shorts/wjqjvrCzoUI)

실제 환경 변수, 운영 데이터베이스, 업로드 파일과 개인 정보는 포함하지 않습니다.

