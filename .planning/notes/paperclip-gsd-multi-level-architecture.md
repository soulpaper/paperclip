---
title: Paperclip GSD 다단계 아키텍처
date: 2026-04-09
context: /gsd-explore 세션 — CEO/리더/엔지니어 계층별 GSD 사용 범위 설계
---

# Paperclip GSD 다단계 아키텍처

## 확정된 계층 구조

```
보드(나)
  → CEO
      → Leader (CTO / CMO / 리서치 대장 등)
          → Engineer (Paperclip 에이전트)
```

## 계층별 GSD 사용 범위

| 역할 | GSD 사용 범위 | 위임 방식 |
|------|-------------|----------|
| CEO | discuss + plan-phase + execute-phase | Paperclip 태스크로 Leader에게 |
| Leader | plan-phase + execute-phase | Paperclip 태스크로 Engineer에게 |
| Engineer | 없음 (직접 실행) | — |

### CEO
- 보드로부터 추상적인 큰 태스크를 받음
- discuss로 보드와 코멘트를 주고받으며 요구사항 구체화
- plan-phase로 REQUIREMENTS.md, PLAN.md 생성
- execute-phase로 Leader들에게 Paperclip 서브태스크 위임
- new-project는 프로젝트 최초 1회만 사용

### Leader (CTO / CMO / 리서치 대장)
- CEO가 만든 PLAN.md를 입력으로 받음
- discuss 불필요 — CEO가 이미 요구사항을 구체화함
- plan-phase로 자기 도메인 파트를 더 잘게 쪼갠 PLAN.md 생성
- execute-phase로 Engineer들에게 Paperclip 서브태스크 위임
  - 태스크 생성 시 반드시 포함: PLAN.md 경로 + 담당 섹션 + 완료 기준
- CEO PLAN.md가 너무 추상적일 경우 GSD discuss 대신 Paperclip 코멘트로 CEO에게 질문

### Engineer
- Leader가 만든 Paperclip 태스크를 받음
- 태스크에 포함된 PLAN.md 경로 + 섹션 읽고 바로 실행
- GSD execute-phase 사용 안 함 — 이미 충분히 쪼개진 단위이므로 오버헤드만 발생

## .planning/ 디렉토리 구조

태스크별 격리 — Paperclip 태스크 ID 기준:

```
.planning/
  tasks/
    {task-id}/          ← CEO 태스크
      PLAN.md
      REQUIREMENTS.md
      tasks/
        {subtask-id}/   ← Leader 태스크
          PLAN.md
        {subtask-id}/   ← 다른 Leader 태스크
          PLAN.md
```

- 리더가 동시에 여러 태스크를 받아도 디렉토리 충돌 없음
- Engineer가 참조할 PLAN.md 경로가 태스크 생성 시 명확하게 전달됨

## Context Rot 방지 메커니즘

Leader가 Engineer에게 Paperclip 태스크 생성 시 반드시 포함:
- `.planning/tasks/{id}/PLAN.md` 경로
- 담당 섹션 명시
- 완료 기준 (acceptance criteria)

이 규칙이 지켜지면 Engineer는 컨텍스트를 추론할 필요 없이 문서에서 바로 읽고 시작 가능.

## AGENTS.md 파일 구조

```
server/src/onboarding-assets/
  ceo/AGENTS.md      ← CEO 전용 (GSD 풀 사이클)
  leader/AGENTS.md   ← CTO/CMO/리서치 대장 공통
  default/AGENTS.md  ← Engineer 및 기타
```

`default-agent-instructions.ts` 매핑:
- `ceo` → ceo
- `cto`, `cmo`, `research_lead` 등 → leader
- 나머지 → default
