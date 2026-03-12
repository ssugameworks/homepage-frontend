# GAMEWORKS — 글로벌미디어학부 종합 학술 소모임

숭실대학교 글로벌미디어학부의 학술 소모임 **GAMEWORKS**의 공식 홈페이지 프론트엔드 프로젝트입니다.
본 프로젝트는 현대적인 웹 기술을 활용하여 소모임의 가치와 활동, 역사를 시각적으로 풍부하게 전달하는 것을 목표로 합니다.

## 🚀 기술 스택

- **Runtime & Bundler**: [Bun](https://bun.sh) (전체적인 빌드 및 실행 프로세스 최적화)
- **Frontend Framework**: React 19 (TypeScript)
- **Styling**: Tailwind CSS 4
- **Animation**: Framer Motion (고급 인터랙션 및 스크롤 효과 구현)
- **State Management**: Zustand, TanStack Query (React Query)
- **Deployment**: GitHub Actions를 통한 자동 배포 (GitHub Pages 활용)

## ✨ 주요 기능 및 페이지

- **🏠 Homepage (`/`)**: 
  - Framer Motion을 활용한 역동적인 히어로 섹션 및 스크롤 애니메이션
  - 소모임 소개, 활동 통계, 주요 연혁 및 이벤트 카드 섹션
- **👥 Members (`/members`)**: 
  - 2026년 임원진 소개를 위한 인터랙티브 카드 캐러셀
  - 각 멤버의 역할, 강점 및 상세 프로필 정보 제공
- **📜 History (`/history`)**: 
  - 2000년부터 이어져 온 GAMEWORKS의 주요 이정표를 타임라인 형식으로 제공
- **📅 Roadmap/Activity (`/activity`, `/roadmap`)**: 
  - 소모임의 연간 일정과 상세 활동 내용을 캘린더 및 패널 형태로 시각화
- **🧭 Custom Routing**: 
  - 라이브러리 의존성을 줄인 `popstate` 기반의 경량화된 라우팅 시스템

## 🛠️ 시작하기

### 의존성 설치
```bash
bun install
```

### 개발 서버 실행
```bash
bun dev
```

### 프로덕션 빌드
```bash
bun build
```

### 프로덕션 서버 실행
```bash
bun start
```

## 📂 프로젝트 구조

```text
src/
├── assets/          # 이미지 및 아이콘 자산
├── lib/             # 공통 유틸리티, 라우팅 정의, API 설정
├── pages/           # 각 페이지 컴포넌트 (homepage, members, history, roadmap)
│   ├── history/
│   ├── homepage/    # 메인 페이지 및 하위 섹션/컴포넌트
│   ├── members/
│   └── roadmap/
├── store/           # 전역 상태 관리 (Zustand)
├── App.tsx          # 메인 앱 컴포넌트 및 라우팅 로직
├── frontend.tsx     # React 엔트리 포인트
└── index.ts         # Bun 서버 엔트리 포인트 및 API 라우트
```

---
© 2026 GAMEWORKS. All rights reserved.
