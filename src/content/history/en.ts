import type { RoadmapItem } from "@/lib/api";

// 연혁 데이터 (영어) - ko.ts 와 같은 타입. period 는 YYYY.MM 그대로(연도 묶음 · 월 표시는 화면이 언어별로)
export const HISTORY_EN: RoadmapItem[] = [
  { id: 20, slug: "bucheon-univ-start", title: "Enrolled at Bucheon University", description: "Information and Communications", period: "2019.03", story: null, status: "LEARNED", targetDate: null, sortOrder: 1 },
  { id: 19, slug: "bucheon-univ-grad", title: "Graduated from Bucheon University", description: "Associate degree", period: "2021.02", story: null, status: "SUCCEEDED", targetDate: null, sortOrder: 2 },
  { id: 17, slug: "hta-backend-bootcamp", title: "Started Joongang HTA backend course", description: "Government-funded backend bootcamp", period: "2021.07", story: null, status: "LEARNED", targetDate: null, sortOrder: 4 },
  { id: 16, slug: "jeongsan-sanup-pass", title: "Industrial Engineer Information Processing", description: "HRD Korea", period: "2021.08", story: null, status: "SUCCEEDED", targetDate: null, sortOrder: 5 },
  { id: 21, slug: "hta-complete", title: "Completed Joongang HTA", description: "Applied Software Engineering for Web Content Development", period: "2022.01", story: null, status: "SUCCEEDED", targetDate: null, sortOrder: 5 },
  { id: 15, slug: "sangsang-join", title: "Joined Sangsang Story", description: "First job, junior full-stack developer", period: "2022.03", story: null, status: "SUCCEEDED", targetDate: null, sortOrder: 6 },
  { id: 14, slug: "credit-bank-start", title: "Enrolled in Academic Credit Bank", description: "Working toward a bachelor's degree", period: "2022.05", story: null, status: "LEARNED", targetDate: null, sortOrder: 7 },
  { id: 13, slug: "jeongsan-gisa", title: "Engineer Information Processing", description: "HRD Korea", period: "2023.06", story: null, status: "SUCCEEDED", targetDate: null, sortOrder: 8 },
  { id: 11, slug: "network-admin", title: "Network Administrator Level 2", description: "ICQA", period: "2023.10", story: null, status: "SUCCEEDED", targetDate: null, sortOrder: 10 },
  { id: 10, slug: "credit-bank-grad", title: "Graduated via Academic Credit Bank", description: "Earned a bachelor's degree", period: "2024.02", story: null, status: "SUCCEEDED", targetDate: null, sortOrder: 11 },
  { id: 9, slug: "sqld-pass", title: "SQL Developer (SQLD)", description: "Korea Data Agency", period: "2024.04", story: null, status: "SUCCEEDED", targetDate: null, sortOrder: 12 },
  { id: 8, slug: "sangsang-leave", title: "Left Sangsang Story", description: "Left first job", period: "2024.04", story: null, status: "LEARNED", targetDate: null, sortOrder: 13 },
  { id: 5, slug: "compuzone-join", title: "Joined Compuzone", description: "Second job", period: "2024.12", story: null, status: "SUCCEEDED", targetDate: null, sortOrder: 16 },
  { id: 4, slug: "compuzone-leave", title: "Left Compuzone", description: "Left second job", period: "2025.04", story: null, status: "LEARNED", targetDate: null, sortOrder: 17 },
  { id: 3, slug: "kernel-academy", title: "Started Kernel Academy", description: "Backend bootcamp", period: "2025.06", story: null, status: "LEARNED", targetDate: null, sortOrder: 18 },
  { id: 22, slug: "kernel-academy-complete", title: "Completed Kernel Academy", description: "AI-Integrated Backend Development Bootcamp", period: "2025.12", story: null, status: "SUCCEEDED", targetDate: null, sortOrder: 18 },
  { id: 2, slug: "uxn-join", title: "Joined UXN", description: "CGM medical device company, full-stack developer", period: "2026.03", story: null, status: "IN_PROGRESS", targetDate: null, sortOrder: 19 },
];
