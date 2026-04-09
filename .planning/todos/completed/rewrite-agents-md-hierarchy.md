---
title: 3계층 에이전트 AGENTS.md 최종 작성
date: 2026-04-09
priority: high
area: agents
---

## 할 일

설계 결정사항(notes/agent-hierarchy-design.md)을 반영하여 세 계층 AGENTS.md를 최종 작성한다.

### 대상 파일

- `server/src/onboarding-assets/ceo/AGENTS.md`
  - gsd-discuss-phase 조건부 실행 (이슈 모호할 때만) 명시
  - git commit 강제 워크플로우 추가
  - .planning/tasks/{id}/PLAN.md 경로 구조 반영

- `server/src/onboarding-assets/leader/AGENTS.md`
  - discuss-phase 완전 제거
  - gsd-research-phase + gsd-review 추가
  - .planning/tasks/{id}/{role}/PLAN.md 경로 구조 반영
  - git commit 강제 워크플로우 추가
  - 완료 시 @CEO 멘션 명시

- `server/src/onboarding-assets/worker/AGENTS.md`
  - 완료 시 @리더 멘션 명시

## 완료 기준

세 파일 모두 설계 결정사항과 일치하고, 각 계층 에이전트가 파일만 읽고 독립적으로 작업 시작 가능한 상태
