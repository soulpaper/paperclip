---
title: Per-adapter token quota with session-resume
date: 2026-04-09
context: exploration
---

# Per-adapter token quota — design notes

## Intent
회사(company)별로 사용 가능한 토큰 한도를 **AI 어댑터 단위**(claude_local, gemini_local, …)로 설정하고, 한도의 80%에 도달하면 해당 어댑터의 작업을 일시정지. 리셋되면 중단된 지점에서 resume.

## Key decisions

- **단위: 토큰 수** (not $ cost). 이유: user가 Claude Max 구독제 사용 → 비용 계산 의미 없음.
- **리셋 주기: Anthropic 5시간 롤링 윈도우 미러링**. Max 플랜의 실제 제한과 일치.
- **안전 마진: 이중 보수적**
  - 토큰: 설정 한도의 **80%**에서 이미 차단
  - 시간: 5시간 윈도우를 **4시간 30분**으로 축소 추정 (첫 토큰 소비 시각 + 4h30m)
- **집계 소스: paperclip 자체 집계만** (Option A). Claude Max는 Admin API 사용량 조회 불가. stream-json `usage` 이벤트 누적.
- **Pause 시맨틱: resume-first**. 에이전트 = 영속 Claude 세션. 얼렸다가 `claude --resume <id>`로 이어감.

## Current infra coverage (~70% already present)

| 요구 | 상태 | 위치 |
|---|---|---|
| Adapter 종류 인식 | ✓ | packages/shared/src/constants.ts:24-35 (`claude_local`, `gemini_local`, …) |
| session_id 영속화 | ✓ | `runtime.sessionParams.sessionId` DB 저장 |
| `--resume` 호출 | ✓ | claude execute.ts:421, gemini execute.ts:323 |
| stream-json usage 파싱 | ✓ | claude parse.ts:7-76, gemini parse.ts:172-175 |
| 스테일 세션 auto-recover | ✓ | claude execute.ts:582-595 |
| **실시간 토큰 집계** | ✗ | 현재는 프로세스 종료 후에만 usage 반환 |
| **Mid-run pause** | ✗ | max_turns / timeout 외 중단 경로 없음 |
| **쿼터 상태 머신** | ✗ | `blocked_by_quota` 상태 / 리셋 타이머 워커 없음 |

## Phase split

### Phase A (simple, high-value)
- 태스크 **시작 전** 쿼터 체크 → 80% 초과 시 `blocked_by_quota`
- 진행 중 태스크는 그대로 완료 (보수적 마진으로 초과 폭 제한)
- 어댑터별 per-window 누적 집계 (input + output + cache_creation 합산; cache_read는 별도 표시하되 쿼터엔 포함?)
- 리셋 타이머 워커: 윈도우 만료 시 blocked 큐 재개 → 기존 session_id로 `--resume` 자동 동작 (공짜로 "이어감" 체감 달성)
- UI: 어댑터별 사용률 게이지, 리셋까지 남은 시간, blocked 태스크 목록

### Phase B (defer)
- 실시간 스트림 집계 → 턴 경계에서 진행 중 태스크도 pause
- SIGTERM + checkpoint 메커니즘 연구 필요 (research questions 참조)

## Open questions
- cache_read_input_tokens를 쿼터에 포함시킬 것인가? (Anthropic 실제 한도 계산 방식 확인 필요)
- 한도 설정 스코프: company 전역? workspace별? per-agent override 허용?
- 80% 도달 시 사용자/관리자 알림 채널 (UI toast? email? webhook?)
