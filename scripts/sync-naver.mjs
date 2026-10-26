// 네이버 블로그 RSS → src/content/posts.json 동기화
// - RSS 는 최근 50개만 주므로, 한 번 받은 글은 파일에 남기고 절대 지우지 않음 (새 글만 추가)
// - 썸네일은 네이버가 외부 사이트 표시를 막아서(403) public/blog/naver/ 에 받아 둠
// - 빼고 싶은 글은 posts.json 에서 직접 지우면 됨 (다시 안 들어오게 하려면 EXCLUDE_IDS 에 글 번호 추가)
// 실행: node scripts/sync-naver.mjs
import fs from "node:fs/promises";
import path from "node:path";

const BLOG_ID = "wonjun13_";
const RSS_URL = `https://rss.blog.naver.com/${BLOG_ID}.xml`;
const ROOT = path.resolve(import.meta.dirname, "..");
const DATA_FILE = path.join(ROOT, "src/content/posts.json");
const THUMB_DIR = path.join(ROOT, "public/blog/naver");

// 사이트에 안 올릴 카테고리 (예: 백준 풀이)
const EXCLUDE_CATEGORIES = ["알고리즘 기록지(25~)"];
const EXCLUDE_IDS = [];

const unescape = (s) =>
  s
    .replace(/<!\[CDATA\[|\]\]>/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .trim();

const tag = (xml, name) => {
  const m = xml.match(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`));
  return m ? unescape(m[1]) : "";
};

// "Mon, 26 Jan 2026 17:34:54 +0900" → "2026-01-26T08:34:54Z" - 시각은 UTC 로 저장하고 화면에서 보는 사람 시간대로 바꿈
function toIsoUtc(pubDate) {
  return new Date(pubDate).toISOString().replace(/\.\d{3}Z$/, "Z");
}

// RSS 썸네일(blogthumb)은 정사각형으로 잘린 365px 라, 같은 경로를 본문용 서버(mblogthumb-phinf)에서
// type=w800 으로 받으면 잘리지 않은 원본 비율·800px 로 옴. 실패하면 RSS 썸네일 그대로
async function downloadThumb(url, id) {
  const full = `https://mblogthumb-phinf.pstatic.net${new URL(url).pathname}?type=w800`;
  let res = await fetch(full);
  if (!res.ok) res = await fetch(url);
  if (!res.ok) return null;
  const type = res.headers.get("content-type") ?? "";
  const ext = type.includes("png") ? "png" : type.includes("gif") ? "gif" : type.includes("webp") ? "webp" : "jpg";
  await fs.mkdir(THUMB_DIR, { recursive: true });
  await fs.writeFile(path.join(THUMB_DIR, `${id}.${ext}`), Buffer.from(await res.arrayBuffer()));
  return `/blog/naver/${id}.${ext}`;
}

const data = JSON.parse(await fs.readFile(DATA_FILE, "utf8").catch(() => '{"posts":[]}'));
const known = new Set(data.posts.map((p) => p.id));

const rss = await (await fetch(RSS_URL)).text();
const items = [...rss.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((m) => m[1]);

const added = [];
for (const it of items) {
  const id = tag(it, "guid").split("/").pop();
  const category = tag(it, "category");
  if (!id || known.has(id) || EXCLUDE_IDS.includes(id) || EXCLUDE_CATEGORIES.includes(category)) continue;

  const desc = tag(it, "description");
  const imgSrc = desc.match(/<img[^>]*src="([^"]+)"/)?.[1] ?? null;
  const text = desc.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

  added.push({
    id,
    // 네이버 말머리 "[IT산업체/보충역]" 는 사이트에선 뺌
    title: tag(it, "title").replace(/^\s*\[[^\]]*\]\s*/, ""),
    excerpt: text ? text.slice(0, 120) : null,
    publishedAt: toIsoUtc(tag(it, "pubDate")),
    thumbnail: imgSrc ? await downloadThumb(imgSrc, id) : null,
    tags: tag(it, "tag").split(",").map((t) => t.trim()).filter(Boolean),
    category,
    url: `https://blog.naver.com/${BLOG_ID}/${id}`,
  });
}

if (added.length === 0) {
  console.log("새 글 없음");
} else {
  data.posts = [...data.posts, ...added].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2) + "\n");
  console.log(`새 글 ${added.length}개 추가:`);
  for (const p of added) console.log(`- ${p.publishedAt} ${p.title}`);
}
