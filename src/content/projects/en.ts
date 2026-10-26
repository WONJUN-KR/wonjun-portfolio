import type { ProjectText } from "@/lib/projects";
import type { ProjectSlug } from "./ko";

// 프로젝트 영어 글자 - slug 별로 글자만 (사진 · 스택 · 링크는 ./ko.ts 하나). 배열 개수 · 순서는 ko 와 같아야 함(다르면 빌드 에러)
// 영어 문구 규칙: myPart 는 과거형 동작 동사로 시작, features 는 현재형, 'I' 없음, 가운뎃점 대신 쉼표 · and, 기간은 'Jan 2026 – Present'
// 숫자 · 고유명사 · 기술 이름은 원문 그대로. 한국어에서 한 줄인 짧은 줄은 1280px 에서도 한 줄(약 40자 이내)
export const PROJECTS_EN_TEXT = {
  "eureka-2026": {
    title: "Eureka (2026 Rebuild)",
    subtitle: "Travel spot sharing community, a 2021 team project rebuilt on a modern stack (personal project)",
    period: "Jan 2026 – Present",
    role: "Solo full-stack developer",
    tagline: "Rebuilt a 2021 team project in Next.js 16 and Spring Boot 3.5, preserving the original screen structure in a responsive layout",
    features: [
      "Keeps region, city, and theme filters in the URL query string, so refreshes and shared links show the same view",
      "Supports sign-in, token refresh, likes, and photo posts, with S3 or local-disk storage switched by profile",
      "Cut home-page image transfer by 88% (7.2MB to 0.9MB) through image optimization",
    ],
    myPart: [
      "Built the entire project solo, from interpreting the original spec to FE, BE, local dev environment, and automated QA",
      "[BE] Built JWT auth, post, like, and image APIs; abstracted image storage (S3 or local) and seeded data from the original",
      "[FE] Rebuilt the original screens (mega menu, Best Picks, Cities to Visit, post editor) as responsive layouts",
      "[Dev env] Set up one-command startup with docker-compose and a local profile, plus headless-browser QA scripts",
    ],
    mockup: {
      note: "Captured locally with demo data. Photos are free Unsplash images.",
      shots: [
        "Main banner",
        "Region and theme mega menu",
        "Best Picks of the Month: top-liked post per category",
        "Cities to Visit",
        "Post list with region and category filters",
        "Post detail with photos and likes",
        "Post editor with photo upload",
        "Mobile view (390px)",
      ],
      videos: [
        "Home: banner, Best Picks, and recommended cities",
        "Write a post → upload 2 photos → publish → detail",
      ],
      related: "View the 2021 original",
    },
  },
  "gotcha": {
    title: "GOTCHA",
    subtitle: "Gacha shop finder on the App Store",
    period: "Jan – Nov 2026",
    role: "Full-stack developer, team of 9",
    tagline: "A map app for finding nearby gacha shops, kept up to date by user reviews and reports",
    features: [
      "Finds nearby gacha shops on a map, with pin previews and search-this-area",
      "Shows shop info, reviews, and favorites",
      "Lets users report shops with a map pin",
      "Sends update notifications",
    ],
    myPart: [
      "[FE] Built home map browsing with a 3-snap pin preview bottom sheet, restoring position and zoom on back navigation",
      "[FE] Built shop reporting and My Page",
      "[FE+BE] Built report and block features and Web Push notifications (subscription UI and sending server)",
      "Set up the project and GitHub Actions CI/CD; tuned web performance (critical CSS, fonts, preconnect)",
    ],
    mockup: {
      note: "Captured in the iOS app as a guest. Other users' nicknames are blurred.",
      shots: [
        "Start screen: social sign-in or browse as a guest",
        "Home: nearby shop pins with a list sorted by distance",
        "Location search with live place suggestions",
        "Shops near the searched spot, with open status and distance",
        "Pin preview: address, hours, and photos",
        "Shop detail: hours, photos, and visitor reviews",
        "Visitor reviews with photos",
        "List expanded to show all nearby shops at a glance",
        "Report: drop a pin to fill in the address",
        "Duplicate check for shops within 50m",
        "Shop details form: name, location hint, and open days",
        "Community: daily posts, questions, and trades",
      ],
      videos: [
        "First launch: guest → terms → notifications → home",
        "Search: location → pin preview → detail and reviews",
        "Map browsing: search again → list → map state kept",
        "Report: set location → duplicate check → shop details",
      ],
    },
  },
  "ai-auto-posting": {
    title: "AI Auto Posting",
    subtitle: "Automated blog publishing platform",
    period: "Nov – Dec 2025",
    role: "Full-stack developer, team of 6",
    tagline: "Generates blog posts from trending keywords with AI and publishes them to connected blogs automatically",
    features: [
      "Connects blogs and schedules workflows",
      "Turns trending keywords into AI posts",
      "Tracks publishing history and results",
    ],
    myPart: [
      "[Lead] Owned scope, roles, and schedule",
      "[BE] Built admin statistics APIs for publishing by user, post, and blog platform, plus AI token usage",
      "[BE] Built a daily stats aggregation scheduler and optimized stats queries, fixing an ISO week bug",
      "[BE] Built admin user management (blocks suspending oneself or other admins) and common code management",
      "[FE] Built admin dashboard trend charts, paginated stats tables, and common code pages",
    ],
    mockup: {
      note: "Captured locally with demo data and no OpenAI key. Generated results are examples.",
      shots: [
        "Home",
        "Workflow settings: schedule rules and categories",
        "Test run in progress",
        "Test complete: AI post generated and uploaded",
        "Generated post: product, keywords, and body",
        "Run log: crawling → AI generation → posting",
      ],
      videos: [
        "Settings → test run → done → register",
        "Generated post → step-by-step run log",
      ],
    },
  },
  "cos-house": {
    title: "Co's House",
    subtitle: "Home decor community and shop",
    period: "Sep – Oct 2025",
    role: "Full-stack developer, team of 5",
    tagline: "A commerce platform, similar to Korea's 'Today's House', for sharing interior ideas and buying the products",
    features: [
      "Sells products through Toss Payments",
      "Hosts community posts and comments",
      "Supports purchase reviews and My Page",
    ],
    myPart: [
      "[Lead] Owned scope, roles, and schedule",
      "[BE] Built My Page and account deletion",
      "[BE] Built admin product and order tools",
      "[BE] Built comments and post editing",
      "Refactored Thymeleaf views and CSS",
    ],
    mockup: {
      note: "Captured locally with demo data. Third-party product photos are blurred.",
      shots: [
        "Home",
        "Shop: category tabs and product list",
        "Product detail: options, cart, and checkout",
        "Community: home tour posts",
        "Home tour detail: photo slider and comments",
        "My Page: purchase reviews (my work)",
        "Admin dashboard",
        "Admin product management and search (my work)",
        "Mobile view (390px)",
      ],
      videos: [
        "Shop → product detail → cart",
        "Home tour list → post detail → comments",
      ],
    },
  },
  "eureka-2021": {
    title: "Eureka (2021 Original)",
    subtitle: "Travel spot community, 2021 bootcamp project",
    period: "2021",
    role: "Full-stack developer, team of 3",
    tagline: "A JSP community for sharing hidden travel spots with photos",
    features: [
      "Finds places by region, city, and theme",
      "Walks users through posting: category → region → companions → theme → photos → upload",
      "Features Best Picks and Cities to Visit",
    ],
    myPart: [
      "[2026 restoration] Reverse-engineered the schema from DAO SQL without a DB dump and rebuilt it on Oracle in Docker",
      "[2026 restoration] Moved hard-coded DB credentials into environment variables",
      "[2026 restoration] Wrote a one-command Tomcat 9 + Oracle startup script and recorded screenshots and flow videos",
    ],
    mockup: {
      note: "The 2021 original, run locally again in 2026 for these captures.",
      shots: [
        "Main banner",
        "Region and theme mega menu",
        "Best Picks of the Month",
        "Cities to Visit",
        "Post list",
        "Reading view",
        "Step-by-step post editor",
      ],
      videos: [
        "Home: banner, menu, and Best Picks",
        "Step-by-step editor → save → reading view",
      ],
      related: "View the 2026 rebuild",
    },
  },
} satisfies Record<ProjectSlug, ProjectText>;
