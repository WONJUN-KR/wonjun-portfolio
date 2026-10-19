import type { AboutContent, CareerItem, SkillItem } from "@/lib/api";

// "2022.05 ~ 2024.04" / "2026.03 ~ 재직중" → 시작·끝 달 포함 개월 수 (잡사이트와 같은 셈법)
function careerMonths(period: string, now: Date): number {
  const m = period.match(/(\d{4})\.(\d{1,2})\s*~\s*(?:(\d{4})\.(\d{1,2})|재직중)/);
  if (!m) return 0;
  const start = Number(m[1]) * 12 + Number(m[2]);
  const end = m[3] ? Number(m[3]) * 12 + Number(m[4]) : now.getFullYear() * 12 + now.getMonth() + 1;
  return Math.max(0, end - start + 1);
}

// 경력 기간 합계 - 오늘 날짜 기준으로 자동 계산 (재직중이면 매달 늘어남)
export function totalCareerPeriod(careers: CareerItem[], now = new Date()): string {
  const total = careers.reduce((sum, c) => sum + careerMonths(c.period, now), 0);
  const years = Math.floor(total / 12);
  const months = total % 12;
  return [years && `${years}년`, months && `${months}개월`].filter(Boolean).join(" ") || "0개월";
}

// 스킬을 kind 별로 묶음 (처음 나온 순서 유지, kind 없으면 한 덩어리)
export function groupSkillsByKind(items: SkillItem[]): { kind?: string; items: SkillItem[] }[] {
  const groups: { kind?: string; items: SkillItem[] }[] = [];
  for (const s of items) {
    const g = groups.find((x) => x.kind === s.kind);
    if (g) g.items.push(s);
    else groups.push({ kind: s.kind, items: [s] });
  }
  return groups;
}

// 홈 숫자 카드 - 커밋 수 대신 결과 지표. 아래 careers 문구에 있는 숫자만 씀 (basis = 근거 한 줄)
export const HOME_HIGHLIGHTS: { label: string; value: string; basis: string }[] = [
  { label: "신규 구축", value: "3개", basis: "혈당·센서·회의록 도구" },
  { label: "무중단 배포", value: "3개 서비스", basis: "배포 중 의료 서비스 중단 0건" },
  { label: "AWS 무손실 이전", value: "2건", basis: "의료 데이터 유실 0건" },
];

// 이력서 데이터 - 홈(/)과 Resume(/resume)이 함께 씀. DB 대신 코드로 관리해서 수정 이력이 커밋으로 남음
export const ABOUT: AboutContent = {
  profile: {
    name: "오원준",
    tagline: "의료 IT 풀스택 개발자",
    email: "dnjswns0010@naver.com",
    region: "경기 시흥",
    // 읽을 때마다 careers 기간으로 계산
    get careerPeriod() {
      return totalCareerPeriod(ABOUT.careers);
    },
    isEmployed: true,
    contacts: {
      githubPersonal: "https://github.com/WONJUN-KR",
      blog: "https://blog.naver.com/wonjun13_",
      linkedin: "https://www.linkedin.com/in/wonjun1013/",
    },
    intro:
      "연속혈당측정(CGM) 의료기기 기업에서 의료 데이터 기반 웹 서비스와 사내 실험 데이터 플랫폼을 프론트엔드부터 백엔드·인프라까지 담당하고 있습니다. " +
      "온프레미스 서비스의 AWS 무손실 이전, CI/CD 및 무중단 배포 체계 구축, 레거시 시스템 보안 정비를 주도했습니다.",
  },
  careers: [
    {
      company: "(주)유엑스엔",
      role: "풀스택 개발",
      period: "2026.03 ~ 재직중",
      isCurrent: true,
      summary: "연속혈당측정 의료기기 웹 서비스·사내 데이터 플랫폼·IoT 플랫폼 6개 프로젝트 동시 담당 (개발부터 인프라·배포까지)",
      projects: [
        {
          title: "개인용 연속혈당 모니터링 서비스 - AWS 이전·배포 전담, 관리자 콘솔 신규 구축",
          period: "2026.04 ~ 진행중",
          details: [
            "온프레미스 → AWS(EC2·RDS) 이전: 수십만 행 전 테이블 일치 검증, 전환 다운타임 약 2.5분, 인증서 자동 갱신",
            "키를 서버에 두지 않는 CI/CD(GitHub Actions + OIDC + SSM)와 nginx blue/green 무중단 배포 - dev 첫 전환에서 외부 점검 236회 실패 0 확인 후 운영 적용, 추가 비용 0원",
            "리포트 조회 응답 8.0초 → 3.6초(구간별 측정으로 반복 쿼리 특정, 29회 → 3회)",
            "관리자 콘솔 0→1 구축(사용자·기기·권한 관리, soft delete), 권한 문자열을 코드 기반 RBAC로 무중단 마이그레이션",
            "React 화면을 서버 UTC 시각 → 사용자 현지 시간 표시로 전환(차트·목록·리포트), jest + jsdom 골든 테스트로 한국 화면 변화 0 검증",
            "시간 저장을 UTC 기준(timestamptz)으로 무중단 전환 - 전환 구간 데이터 유실 0행, 골든 마스터 테스트로 화면 변화 없음 증명",
            "주기적 데이터 처리 스케줄러·FCM 푸시 출시, 처리 로직 교체 시 저장값 전수 재계산·일치 검증",
            "웹·앱 계산 결과가 다른 원인을 찾아 일치율 약 40% → 100%",
          ],
        },
        {
          title: "사내 센서 실험 데이터 분석 플랫폼 - 형상관리·보안·배포 체계 최초 구축",
          period: "2026.04 ~ 진행중",
          details: [
            "목록 조회 20초 → 0.6초(상관 서브쿼리를 CTE로 재작성)",
            "CI/CD: 테스트 게이트 → 헬스체크 → 실패 시 자동 롤백, blue/green 무중단 배포, 테스트 0개 → 211개",
            "접근제어·세션 보안 체계 정비 - 관찰 → 차단 2단계로 업무 중단 없이 적용",
            "골든 마스터 테스트로 결과 동일성 유지하며 리팩터링(차트 함수 6→1, SQL 7벌→1, 미사용 코드 373줄 삭제)",
            "레거시 Flask 플랫폼에 형상관리·코드 리뷰 체계 도입",
            "센서 데이터 가공 파이프라인과 시각화 화면 구축 - 그래프·CSV 결과 100% 일치 검증",
            "ApexCharts 기반 데이터 비교 화면(최대 10개 선 겹쳐 보기·좌우 분할, 축 범위 직접 입력·축 비율 연동)",
            "해외 기기 시간대 처리 - 저장은 UTC, 화면은 보는 사람의 브라우저 시간으로(목록·차트·CSV 전체 적용)",
          ],
        },
        {
          title: "연속혈당 파생 서비스 - 단독 구축·AWS 이관·운영",
          period: "2026.06 ~ 진행중",
          details: [
            "온프레미스 → AWS 이관 단독 완료(전 테이블 일치 검증, DNS 전환), blue/green 첫 전환 점검 225회 실패 0",
            "단위 테스트 15개 → 119개, 작성 중 운영 코드 결함 8건 발견, 테스트 설계서 45개 항목",
            "기존 서비스를 복제한 당일 저장소 분리·Docker 배포·HTTPS까지 라이브",
            "단일 세션과 10초 이내 실시간 강제 로그아웃, Google·Kakao OAuth, UTC 저장·현지 시간 표시",
            "중복 이메일 계정 방지(fail-closed 로그인 + DB partial unique index)",
          ],
        },
        {
          title: "고객사 IoT 기기 연동 웹 플랫폼 - 웹뷰·백엔드 개발",
          period: "2026.04 ~ 진행중",
          details: [
            "기기 ↔ 서버 ↔ 웹뷰 실시간 통신(WebSocket) 구축",
            "Tailwind 전환으로 인라인 스타일 167 → 31개(-81%), 접근성 수정 20곳(div → button), 다국어 지원",
          ],
        },
        {
          title: "센서 감도표 관리 도구 - 단독 개발",
          period: "2026.04 ~ 진행중",
          details: [
            "저장소 생성부터 배포까지 단독 구축, 버전 이력·UPSERT 저장, CSV(RFC 4180)·엑셀 일괄 등록",
            "동시 업로드 중복 생성을 PostgreSQL ON CONFLICT 로 원자화, QA 12건 해결",
            "대량 갱신은 ROLLBACK 드라이런으로 먼저 검증 후 커밋, 전극별 감도표·모바일 화면 추가",
          ],
        },
        {
          title: "기타",
          period: "2026.04 ~",
          details: [
            "사내 회의록 정리 도구 신규 풀스택(FastAPI + React·Vite·TypeScript), 무중단 교체 중 연속 요청 3,298건 전부 성공",
            "팀 문서 저장소 신설(링크·비밀값 자동 검사), PR 컨벤션 정립 후 기존 PR 386개 정리, 6개 프로젝트 인수인계 문서 작성",
          ],
        },
      ],
      stack: [
        "Java", "Python", "JavaScript", "TypeScript", "Spring Boot", "Flask", "React", "Next.js",
        "Spring Security", "JPA", "Tailwind CSS", "Zustand", "ApexCharts",
        "AWS", "Docker", "nginx", "GitHub Actions", "FCM", "PostgreSQL",
      ],
      sortOrder: 1,
    },
    {
      company: "상상스토리(주)",
      position: "연구소 · 주임",
      role: "웹개발",
      period: "2022.03 ~ 2024.04",
      region: "서울",
      resignReason: "학업",
      summary: "Spring 기반 웹 시스템 3건 개발·운영 (포털, LMS, 시설물 관리) (2022.03~04 수습 2개월은 사업소득, 2022.05 병역특례 편입과 함께 정규 전환)",
      projects: [
        {
          title: "사내 포털 및 접근권한 관리 시스템 개발",
          period: "2022.05 ~ 2023.08",
          details: [
            "eGovFramework 기반 포털 시스템 신규 구축",
            "Spring Security 활용 RBAC 기반 권한 관리 및 인증 시스템 설계·구현",
            "시큐어 코딩 가이드 적용 및 보안 강화",
            "Docker 기반 사내 서버 운영 환경 구축 및 최적화",
          ],
        },
        {
          title: "LMS 및 시설물 관리 시스템 고도화",
          period: "2023.08 ~ 2024.04",
          details: [
            "SQL Injection, XSS 등 보안 취약점 60건 전수 점검·개선",
            "웹 접근성 WAX Scanner 70 → 90점 개선 (KWCAG 인증 획득)",
            "법무부 솔로몬로 포탈, LMS, 시설물 관리 시스템 개발 및 성능 최적화",
            "N+1 문제 해결을 위한 쿼리 튜닝",
            "RESTful API 설계 및 로그/통계 대시보드 구현",
            "서버 관리 자동화 및 장애 대응 프로세스 체계화",
          ],
        },
      ],
      stack: [
        "Java", "JavaScript", "Spring Framework", "Spring Boot", "eGovFramework", "JSP",
        "Spring Security", "MyBatis", "jQuery", "Linux(CentOS)", "Docker", "Oracle", "MySQL",
      ],
      sortOrder: 2,
    },
  ],
  educations: [
    {
      school: "국가평생교육진흥원 (4년제)",
      department: "정보통신학과",
      period: "2022.05 ~ 2024.02",
      status: "편입/졸업",
      region: "서울",
      gpa: "3.75 / 4.5",
      sortOrder: 1,
    },
    {
      school: "부천대학교 (2·3년제)",
      department: "정보통신학과",
      period: "2019.03 ~ 2021.02",
      status: "졸업",
      region: "경기",
      gpa: "3.49 / 4.5",
      projects: [
        "스마트멀티탭 - IoT 기반 에너지 절약 솔루션 개발 및 안드로이드 앱 연동",
      ],
      sortOrder: 2,
    },
  ],
  trainings: [
    {
      org: "커널아카데미",
      course: "AI 융합 백엔드 개발 부트캠프",
      period: "2025.06 ~ 2025.12",
      learned: [
        "Java", "HTML5", "CSS3", "JavaScript", "TypeScript", "Spring Boot", "JSP", "React",
        "JPA", "jQuery", "AI API", "Oracle", "MySQL", "PostgreSQL",
      ],
      projects: [
        "Co's House (5인 팀, 2025.09 ~ 2025.10) - 인테리어 커뮤니티·쇼핑 통합 플랫폼(Spring Boot). 마이페이지(회원정보 수정·리뷰·탈퇴), 관리자 상품·주문 관리, 커뮤니티 댓글 담당",
        "Youth Compass (5인 팀, 2025.10 ~ 2025.11) - 청년 금융·주택 정책 AI 상담 챗봇(React + Spring Boot + FastAPI·LangGraph RAG). 백엔드 초기 설정과 DTO·Entity·Service·Controller 계층 구성, 사용자 정보 수정 API, FAQ 탭 UI 담당",
        "AI Auto Posting (6인 팀, 2025.11 ~ 2025.12) - AI 블로그 콘텐츠 생성·자동 업로드 파이프라인(Spring Boot + React). 관리자 통계 API·일별 자동 집계 스케줄러·공통코드 관리, 관리자 대시보드 차트·통계 페이징 담당",
      ],
      sortOrder: 1,
    },
    {
      org: "중앙 HTA",
      course: "웹 콘텐츠 개발을 위한 응용SW엔지니어링 양성과정",
      period: "2021.07 ~ 2022.01",
      learned: ["Java", "Oracle", "JSP", "HTML5", "CSS3", "JavaScript", "jQuery", "Spring"],
      projects: [
        "대중교통 통합 예약 어플 (5인 팀, 2021.08 ~ 2021.09, 첫 프로젝트) - 좌석 예약·취소·결제 기능 통합",
        "숨겨진 명소 알리기 사이트 (4인 팀, 2021.10 ~ 2021.11, 두 번째 프로젝트) - 명소 등록/파일 업로드 공유형 웹사이트",
        "농구팀 사이트 (5인 팀, 2021.12 ~ 2022.01, 파이널 프로젝트) - 팀 소개, 공지사항, 질문 기능 + 관리자 페이지",
      ],
      sortOrder: 2,
    },
  ],
  certifications: [
    { name: "정보처리기사", issuer: "한국산업인력공단", acquiredAt: "2023.06" },
    { name: "SQLD (SQL 개발자)", issuer: "한국데이터베이스진흥센터", acquiredAt: "2024.04" },
    { name: "네트워크관리사 2급", issuer: "한국정보통신자격협회", acquiredAt: "2023.10" },
    { name: "정보처리산업기사", issuer: "한국산업인력공단", acquiredAt: "2021.08" },
  ],
  // 키 순서대로 그려짐: 백엔드 → 프론트엔드 → DevOps. 분야 안에서는 kind(언어·프레임워크·라이브러리·데이터베이스) 순서대로 묶음
  skills: {
    backend: [
      { name: "Java", kind: "언어" },
      { name: "Python", kind: "언어" },
      { name: "Spring Boot", kind: "프레임워크" },
      { name: "Spring Framework", kind: "프레임워크" },
      { name: "Flask", kind: "프레임워크" },
      { name: "eGovFramework", kind: "프레임워크" },
      { name: "Spring Security", kind: "라이브러리" },
      { name: "JPA", kind: "라이브러리" },
      { name: "MyBatis", kind: "라이브러리" },
      { name: "JSP", kind: "라이브러리" },
      { name: "PostgreSQL", kind: "데이터베이스" },
      { name: "Oracle", kind: "데이터베이스" },
      { name: "MySQL", kind: "데이터베이스" },
    ],
    frontend: [
      { name: "TypeScript", kind: "언어" },
      { name: "JavaScript", kind: "언어" },
      { name: "Next.js", kind: "프레임워크" },
      { name: "React", kind: "라이브러리" },
      { name: "Tailwind CSS", kind: "라이브러리" },
      { name: "Zustand", kind: "라이브러리" },
      { name: "jQuery", kind: "라이브러리" },
    ],
    infra: [
      { name: "AWS (EC2·RDS·S3·SSM)", kind: "클라우드·서버" },
      { name: "Linux", kind: "클라우드·서버" },
      { name: "systemd", kind: "클라우드·서버" },
      { name: "nginx", kind: "웹 서버" },
      { name: "Caddy", kind: "웹 서버" },
      { name: "GitHub Actions", kind: "CI/CD·배포" },
      { name: "Docker", kind: "CI/CD·배포" },
    ],
  },
  portfolios: [
    { title: "GOTCHA Frontend", url: "https://github.com/fcde-project9/GOTCHA-FE", period: "2026.01.05 ~ 2026.03.02" },
    { title: "GOTCHA Backend", url: "https://github.com/fcde-project9/GOTCHA-BE", period: "2026.01.05 ~ 2026.03.02" },
    { title: "AI Auto Posting Backend", url: "https://github.com/WONJUN-KR/AI-Auto-Posting-Backend", period: "2025.11.17 ~ 2025.12.26" },
    { title: "AI Auto Posting Frontend", url: "https://github.com/WONJUN-KR/AI-Auto-Posting-Frontend", period: "2025.11.17 ~ 2025.12.26" },
    { title: "Co's House (5인 팀)", url: "https://github.com/WONJUN-KR/Co-s_House", period: "2025.09.08 ~ 2025.10.10", teamSize: 5 },
  ],
  military: { status: "군필", type: "산업기능요원 (복무 만료)", period: "2022.05 ~ 2024.04" },
  coverLetter: `## 화면부터 배포까지, 데이터를 잃지 않는 서비스를 책임지는 풀스택 개발자

연속혈당측정(CGM) 의료기기 기업에서 의료 데이터 기반 웹 서비스와 사내 실험 데이터 플랫폼을 개발·운영하고 있습니다. 개인용 혈당 모니터링 서비스, 센서 실험 데이터 분석 플랫폼, 파생 서비스, 고객사 IoT 플랫폼, 감도표 관리 도구, 사내 회의록 정리 도구까지 여섯 개 프로젝트를 동시에 담당하며 React·Next.js 화면부터 Spring Boot·Flask 서버, AWS 인프라와 배포까지 직접 맡아 왔습니다.

### 멈추지 않는 배포와 무손실 이전

수동으로 이뤄지던 배포를 자동화하기 위해 저장소별로 GitHub Actions 파이프라인을 만들고, 서버에 키를 두지 않도록 OIDC와 SSM으로 배포를 연결했습니다. 배포 전에는 테스트 게이트를, 배포 후에는 헬스체크와 자동 롤백을 두었고, nginx 업스트림을 바꾸는 blue/green 방식으로 추가 비용 없이 무중단 배포를 구현했습니다. 배포 중 외부에서 수백 번씩 상태를 점검해 실패가 0건임을 확인했고, 운영과 같은 구성의 검증 환경도 함께 만들어 운영에 영향 없이 검증할 수 있게 했습니다.

온프레미스 서비스 두 개를 AWS(EC2·RDS)로 옮길 때는 "정지 → 최종 동기화 → DNS 전환" 순서의 런북을 먼저 작성했습니다. 수십만 행의 데이터를 테이블 단위로 전수 대조해 데이터 유실 없이, 서비스 중단 약 2.5분 만에 전환을 마쳤습니다.

### 레거시를 안전하게 바꾸기

사내 실험 데이터 플랫폼에 형상관리를 도입하고 코드를 위험도 순으로 정리한 뒤, 접근제어와 보안 체계를 정비했습니다. 차단은 먼저 로그만 남기는 관찰 단계로 실제 호출 경로를 확인한 뒤 적용해 업무가 멈추지 않도록 했습니다. 테스트를 0개에서 211개로 늘리고, 골든 마스터 테스트로 27개 응답이 바이트 단위로 같은지 확인하면서 중복 차트 함수와 SQL을 하나로 합쳤습니다. 20초 걸리던 목록 조회는 상관 서브쿼리를 CTE로 바꿔 0.6초로 줄였습니다.

### 화면까지 직접

React로 사용자·기기·권한을 관리하는 관리자 콘솔을 처음부터 만들었고, Next.js로 고객사 IoT 기기의 웹뷰를 개발하며 기기·서버·화면을 잇는 실시간 통신을 설계했고, 다국어 지원과 Tailwind 전환으로 인라인 스타일 81% 정리까지 맡았습니다. 서버의 시간 저장 방식을 UTC로 바꿀 때는 jest 골든 테스트로 한국 사용자 화면이 바뀌지 않았음을 확인한 뒤 배포했습니다.

### 추측하지 않고 실측하기

그래프가 주기적으로 비는 문제의 원인이 처음 추정과 다르다는 것을 데이터로 확인하고, 웹과 앱의 계산 규칙 차이를 찾아 결과 일치율을 약 40%에서 100%로 맞췄습니다. 운영 데이터를 바꿀 때는 백업과 드라이런, 전수 대조를 먼저 합니다. 데이터 처리 로직을 교체할 때도 저장값을 전부 다시 계산한 뒤 결과가 모두 일치하는지 확인하고 마무리했습니다.

의료 데이터는 한 행도 잃어서는 안 되고, 서비스는 멈추지 않아야 한다고 생각합니다. 화면부터 서버, 배포까지 전 과정을 이해하는 개발자로서 사용자가 믿고 쓰는 서비스를 끝까지 책임지겠습니다.`,
};
