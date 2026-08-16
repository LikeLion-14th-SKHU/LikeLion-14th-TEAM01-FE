## 🦁 SKHU 멋쟁이사자처럼 14기 1팀 프론트엔드 레포지토리입니다.

### Backend API

- Swagger: https://mcm-api.i1000u.store/swagger-ui/index.html#/
- Production API origin defaults to `https://mcm-api.i1000u.store`.
- Local development uses Vite's `/backend` proxy, so API calls work without local CORS setup.
- To use another production API, set `VITE_API_BASE_URL` and `VITE_API_ORIGIN` at build time.

Kakao login starts at `/detective/auth/kakao/login`. The frontend accepts JWT values returned
to its URL as `accessToken`, `refreshToken`, `tokenType`, `accessTokenExpiresIn`, and
`refreshTokenExpiresIn` query (or hash) parameters, stores them, and removes them from the URL.

The current Swagger contract documents `/detective/auth/kakao/callback` as a JSON response on
the backend origin. For a browser login to return to this SPA, the backend must redirect to the
frontend with a one-time authorization code (recommended) or the token parameters above. The
API currently exposes no logout or game-reset endpoint, so logout only clears frontend tokens
and completed/failed games cannot be restarted from the client.
