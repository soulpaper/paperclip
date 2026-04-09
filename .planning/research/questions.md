# Research questions

## Token quota / session pause

- **Claude Code CLI mid-turn pause** — 진행 중인 `claude` 프로세스를 턴 경계에서 안전하게 멈추고 (SIGTERM? 특정 stdin 신호?) 나중에 `--resume <id>`로 동일 지점부터 이어갈 수 있는가? 프로세스를 kill -15로 끝내도 세션 파일(`~/.claude/projects/...`)이 일관된 상태로 남는가, 아니면 partial turn 손상이 생기는가? (Phase B 착수 전 필수)
- **cache_read_input_tokens vs quota** — Anthropic이 Claude Max 5시간 윈도우 계산에 cache_read 토큰을 포함시키는가? 포함되지 않는다면 paperclip 쿼터 집계에서도 제외해야 정합성 유지.
- **5시간 윈도우 시작 시점** — "첫 요청 시각부터 5시간"인가, "첫 토큰 소비 시각"인가? 여러 세션이 겹칠 때 윈도우가 하나인가 세션별인가? 보수적 마진 4h30m 추정이 실제와 얼마나 어긋나는지 검증 필요.
- **Gemini 쿼터 모델** — gemini-local은 유료 API? free tier? Claude Max 같은 롤링 윈도우가 아니라 분/일 RPM+TPM 기반이라면 리셋 주기 설계가 달라짐.
