---
title: Paperclip GSD 통합 설계
date: 2026-04-09
context: /gsd-explore session — Paperclip을 GSD 기반으로 동작하게 개조하는 설계 논의
---

# Paperclip GSD 통합 설계

## 핵심 목표

Paperclip의 C-suite 에이전트(CEO 등)가 태스크를 받으면 바로 실행하지 않고,
GSD 워크플로우를 먼저 타서 구조화된 문서(PROJECT.md, REQUIREMENTS.md, PLAN.md)를
생성한 뒤 하위 에이전트에게 컨텍스트와 함께 위임한다.
이를 통해 context rot을 제거한다.

## 아키텍처 결정사항

### 1. 실행 레이어 — GSD 스킬 마운트

- CEO 에이전트 설정 시 GSD 스킬 디렉토리를 skills로 마운트
- Instructions에 "태스크를 받으면 GSD 플로우부터 타라" 지시 포함
- `claude_local`: 임시 디렉토리 + `--add-dir` (ephemeral)
- `gemini_local`: `~/.gemini/skills/` 심링크 (persistent)
- 둘 다 GSD 스킬 실행 가능 확인됨

### 2. 가시성 레이어 — paperclip-plugin-gsd

- `@codewithahsan/paperclip-plugin-gsd` 플러그인 설치
- `.planning/` 디렉토리를 read-only로 읽어서 Paperclip UI에 표시
- 대시보드 위젯, 프로젝트 탭, 이슈 연동 제공
- 에이전트 종류 무관 (`.planning/`만 있으면 동작)

### 3. 대화 채널 — 코멘트 시스템

- GSD discuss-phase에서 사람과의 토론이 필요할 때
- Paperclip 코멘트 시스템을 통해 보드 유저(나)와 대화
- 향후 전용 UI로 업그레이드 가능

### 4. 적용 범위

- **메인급 에이전트만**: C-suite (ceo, cto, cmo, cfo) 역할의 에이전트
- 단순 태스크를 처리하는 하위 에이전트(engineer 등)는 기존 방식 유지
- 하위 에이전트는 상위에서 생성된 REQUIREMENTS.md, PLAN.md를 컨텍스트로 받음

## GSD 워크플로우 흐름

```
Paperclip 태스크 도착
  → C-suite 에이전트가 태스크 수신
  → GSD new-project 스타일로 보드 유저에게 질문 (코멘트)
  → 보드 유저와 discuss (코멘트 주고받기)
  → PROJECT.md, REQUIREMENTS.md 생성
  → plan-phase로 PLAN.md 생성
  → 하위 에이전트에게 문서 + 태스크 위임
  → paperclip-plugin-gsd가 .planning/ 상태를 UI에 실시간 표시
```

## 기술 확인 사항

- `claude_local` 어댑터: Claude Code CLI 스폰, 풀 런타임 (서브에이전트, 파일 I/O, 스킬 전부 가능)
- `gemini_local` 어댑터: Gemini CLI 스폰, 스킬 마운트 지원, 대부분의 Paperclip 환경변수 주입
- `paperclip-plugin-gsd`: read-only, 이벤트 기반 + 주기적 싱크, claude_local 풀 지원
