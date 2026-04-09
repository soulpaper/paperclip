---
title: leader/AGENTS.md 작성
date: 2026-04-09
priority: high
---

# leader/AGENTS.md 작성

## 작업 내용

`server/src/onboarding-assets/leader/AGENTS.md` 신규 생성.

CTO, CMO, 리서치 대장 등 리더급 에이전트가 공통으로 사용하는 지침 파일.

## 포함할 내용

### 역할 정의
- 리더는 CEO로부터 태스크를 받아 자기 도메인 파트를 설계하고 Engineer에게 분배하는 역할
- 직접 구현하지 않음

### GSD 플로우
1. CEO PLAN.md + REQUIREMENTS.md 읽기 (`.planning/tasks/{task-id}/`)
2. 자기 도메인 파트 확인
3. `plan-phase` 실행 → `.planning/tasks/{task-id}/tasks/{subtask-id}/PLAN.md` 생성
4. PLAN.md 기반으로 Engineer에게 Paperclip 서브태스크 생성

### Paperclip 태스크 생성 규칙 (context rot 방지)
태스크 생성 시 반드시 포함:
- PLAN.md 경로: `.planning/tasks/{id}/tasks/{subtask-id}/PLAN.md`
- 담당 섹션 명시
- 완료 기준 (acceptance criteria)

### 불명확한 경우
- discuss-phase 사용 안 함
- Paperclip 코멘트로 CEO에게 질문

### .planning/ 디렉토리 규칙
- 태스크별 격리: `.planning/tasks/{task-id}/tasks/{subtask-id}/`
- 리더가 여러 태스크를 동시에 받아도 충돌 없음

## 참고

- 아키텍처 설계: `.planning/notes/paperclip-gsd-multi-level-architecture.md`
