---
title: CEO + 리더급 에이전트 GSD 통합 작업
date: 2026-04-09
priority: high
---

# CEO + 리더급 에이전트 GSD 통합 작업

## 작업 내용

### 1. CEO AGENTS.md 수정
- "태스크를 받으면 바로 위임하지 말고 GSD 플로우를 먼저 타라" 규칙 추가
- 흐름: discuss → plan-phase → execute-phase (Paperclip 태스크로 Leader 위임)
- new-project는 프로젝트 최초 1회만 사용한다는 지침 추가

### 2. leader/AGENTS.md 신규 작성
- CTO / CMO / 리서치 대장 공통 지침
- 흐름: CEO PLAN.md 읽기 → plan-phase → Paperclip 태스크 생성 (Engineer 위임)
- discuss 불필요 — 불명확할 경우 Paperclip 코멘트로 CEO에게 질문
- 태스크 생성 규칙: PLAN.md 경로 + 담당 섹션 + 완료 기준 반드시 포함
- .planning/tasks/{task-id}/ 디렉토리 규칙 준수

### 3. default-agent-instructions.ts 수정
- leader 역할 매핑 추가 (cto, cmo, research_lead 등)
- `resolveDefaultAgentInstructionsBundleRole` 함수 확장

### 4. GSD 스킬 마운트 확인
- CEO + Leader 에이전트 설정에 GSD 스킬 디렉토리 등록
- claude_local: `--add-dir` 플래그로 스킬 디렉토리 주입
- gemini_local: `~/.gemini/skills/` 심링크로 주입
- 양쪽 어댑터에서 plan-phase, execute-phase 실행 가능 확인

## 참고

- 아키텍처 설계: `.planning/notes/paperclip-gsd-multi-level-architecture.md`
- 설계 배경: `.planning/notes/paperclip-gsd-integration-design.md`
- Engineer는 GSD 사용 안 함 — default/AGENTS.md 수정 불필요
