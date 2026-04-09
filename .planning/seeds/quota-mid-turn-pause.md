---
title: Mid-turn pause for in-progress tasks on quota exhaustion
trigger_condition: Phase A 배포 후 실사용에서 "진행 중 태스크가 80% → 100% 훌쩍 넘기는" 케이스가 관찰될 때 (예: 한 태스크가 수십 분 이상 돌아서 보수적 마진으로도 초과 폭이 큼)
planted_date: 2026-04-09
---

# Mid-turn pause (Phase B)

## Idea
Phase A는 "태스크 시작 전 체크"만 한다. 진행 중인 태스크는 끝까지 돌려서, 긴 태스크의 경우 80% → 100%를 넘어 초과할 여지가 있다. Phase B는 이를 닫는다:

- 각 어댑터가 stream-json 이벤트를 실시간으로 부모 프로세스에 푸시
- 오케스트레이터가 현재 윈도우 누적 + 해당 이벤트를 합쳐서 임계값 실시간 판정
- 80% 도달 시:
  1. 해당 에이전트의 CLI 프로세스에 graceful stop 신호 (턴이 끝날 때까지 대기)
  2. session_id 보존 확인
  3. 태스크 상태를 `paused_by_quota`로 전환
- 리셋 타이머 만료 시 `claude --resume <id>`로 정확히 중단한 턴 다음부터 이어감

## Preconditions for activation
- Phase A의 `blocked_by_quota` 상태 머신과 리셋 워커가 안정적으로 동작
- `research/questions.md`의 "Claude Code CLI mid-turn pause" 질문에 답이 나와 있음 (SIGTERM 안전성 검증)
- 실사용 로그에서 "long-running task가 보수적 마진을 돌파한 횟수 ≥ N"이 확인됨

## Risks
- Claude Code CLI가 mid-turn kill에 대해 partial 상태를 남기면 resume이 꼬일 수 있음 → 일단 Phase A로 버티는 게 합리적
- 여러 에이전트가 동시에 같은 Claude 구독을 공유할 때, Anthropic 서버 측 실제 한도와 paperclip 추정치가 어긋나면 Phase B의 정교함이 오히려 혼란을 만들 수 있음
