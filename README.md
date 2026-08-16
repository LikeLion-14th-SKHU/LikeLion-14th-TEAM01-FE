## 🦁 SKHU 멋쟁이사자처럼 14기 1팀 프론트엔드 레포지토리입니다.

### Backend API

- Swagger: https://mcm-api.i1000u.store/swagger-ui/index.html#/
- Production API origin defaults to `https://mcm-api.i1000u.store`.
- Local development uses Vite's `/backend` proxy, so API calls work without local CORS setup.
- To use another production API, set `VITE_API_BASE_URL` and `VITE_API_ORIGIN` at build time.

Kakao login starts at `/detective/auth/kakao/login`. After Kakao authorization, the backend
callback redirects to the frontend callback screen with the JWT result in the URL fragment. The
frontend accepts camelCase token fields from that fragment, with query-string, snake_case, and
JSON `tokens` fallbacks, stores the tokens, and immediately removes authentication data from the
URL. The API currently exposes no logout or game-reset endpoint, so logout only clears frontend
tokens and completed/failed games cannot be restarted from the client.
