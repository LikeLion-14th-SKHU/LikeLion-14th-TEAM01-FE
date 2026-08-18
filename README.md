## 🦁 SKHU 멋쟁이사자처럼 14기 1팀 프론트엔드 레포지토리입니다.

### Backend API

- Swagger: https://mcm-api.i1000u.store/swagger-ui/index.html#/
- Production API origin defaults to `https://mcm-api.i1000u.store`.
- Local development uses Vite's `/backend` proxy, so API calls work without local CORS setup.
- To use another production API, set `VITE_API_BASE_URL` and `VITE_API_ORIGIN` at build time.

Kakao login starts at `/detective/auth/kakao/login`. After Kakao authorization, the backend
redirects to the frontend callback with a short-lived, one-time `code`. The frontend immediately
removes the code from the URL, exchanges it through `POST /detective/auth/exchange`, and stores the
returned JWT pair. Logout calls `POST /detective/auth/logout` to revoke the server-side refresh
token and then clears the frontend tokens.
