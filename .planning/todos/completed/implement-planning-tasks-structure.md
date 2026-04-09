---
title: .planning/tasks/ 디렉토리 구조 구현
date: 2026-04-09
priority: medium
area: infrastructure
---

## 할 일

현재 .planning/에 tasks/ 디렉토리가 없음. 이슈별 계획 저장 구조를 구현한다.

## 목표 구조

```
.planning/
└── tasks/
    └── {task-id}/
        ├── PLAN.md            # CEO 작성
        └── {leader-role}/
            └── PLAN.md        # 리더 작성
```

## 구현 항목

1. `.planning/tasks/` 디렉토리 생성 및 .gitkeep 추가
2. GSD 워크플로우에서 tasks/{id}/ 경로를 자동 생성하도록 CEO HEARTBEAT.md 반영
3. leader-role 디렉토리 네이밍 컨벤션 정의 (cto, cmo, ux 등)

## 완료 기준

CEO가 gsd-plan-phase 실행 시 .planning/tasks/{task-id}/PLAN.md에 자동 저장되고, 리더가 자신의 {role}/PLAN.md를 생성할 수 있는 상태
