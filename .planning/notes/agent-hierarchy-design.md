---
title: 에이전트 계층 설계 결정사항
date: 2026-04-09
context: gsd-explore 세션 — CEO/리더/작업자 AGENTS.md 설계
---

## 3계층 구조

```
사용자 (이사회)
  → 아이디어/방향 전달

CEO
  → gsd-new-project (새 프로젝트)
  → gsd-discuss-phase (이슈 설명이 모호할 때만, 자율 판단)
  → gsd-plan-phase → .planning/tasks/{id}/PLAN.md
  → git commit (필수 — 리더가 읽을 수 있도록)
  → 리더에게 하위 태스크 생성 (description에 PLAN.md 경로 포함)

리더 (도메인별)
  → CEO PLAN.md + REQUIREMENTS.md + ROADMAP.md 읽기
  → gsd-research-phase (기술 리서치, 자율 판단)
  → gsd-review (다른 AI 검토로 근거 보강)
  → gsd-plan-phase → .planning/tasks/{id}/{leader-role}/PLAN.md
  → git commit (필수)
  → 작업자에게 하위 태스크 생성

작업자
  → 리더 PLAN.md 기반 gsd-execute-phase
  → 완료 후 리더 태스크에 댓글 + @리더 멘션

리더
  → 결과 검토/수정
  → CEO 태스크에 댓글 + @CEO 멘션

CEO
  → 전체 취합 후 이사회(사용자)에게 보고
```

## 핵심 결정사항

### 리더의 discuss-phase 제거
- 사유: discuss-phase는 사용자와의 대화 — 기술을 모르는 사용자에게 기술 질문을 던지는 것은 의미 없음
- 대체: gsd-research-phase (자율 리서치) + gsd-review (외부 AI 검토)
- 기술적 결정은 리더가 자율 결정

### CEO의 discuss-phase 조건부 실행
- 이슈 설명이 충분하면 스킵, 모호하면 실행
- CEO가 자율 판단

### .planning 디렉토리 구조
```
.planning/
├── phases/                    # 프로젝트 장기 계획 (GSD 표준)
│   └── 01-foo/PLAN.md
└── tasks/                     # 이슈별 실행 계획 (Paperclip)
    └── {task-id}/
        ├── PLAN.md            # CEO 작성
        ├── cto/PLAN.md        # CTO 리더 작성
        ├── cmo/PLAN.md        # CMO 리더 작성
        └── ux/PLAN.md         # UX 리더 작성
```

### 확장성
- 리더 추가 시 디렉토리만 추가
- 리더 아래 하위 리더 중첩 가능 (예: cto/backend/PLAN.md)

### 보고 흐름 (@mention 기반)
- Paperclip에 하위 태스크 완료 시 자동 wakeup 없음
- 명시적 @mention으로 상위 에이전트 깨움
- 작업자 → @리더 멘션 → 리더 → @CEO 멘션

### git commit 강제
- CEO/리더는 PLAN.md 작성 후 반드시 커밋
- 커밋 전 하위 태스크 생성 금지
- 사유: 커밋 없으면 하위 에이전트가 파일 접근 불가
