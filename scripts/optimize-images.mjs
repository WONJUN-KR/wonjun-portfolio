// 빌드 전에 public 이미지를 WebP 로 줄여 public/_opt 에 만듦 (npm run build / dev 앞에서 자동 실행)
// Next 이미지 최적화는 요청 때마다 서버에서 하는 방식이라, 원본이 큰 사진은 미리 줄여두고 그대로 내려줌
// 원본은 그대로 두고 결과물(public/_opt)은 git 에 안 올림. 원본보다 새 결과가 있으면 건너뜀
import { readdir, stat, mkdir } from "node:fs/promises";
import { join, dirname, extname, relative } from "node:path";
import sharp from "sharp";

const PUBLIC = "public";
const OUT = join(PUBLIC, "_opt");
// 폴더별 최대 너비 = 화면에서 가장 크게 보이는 크기 × 2 (레티나)
const TARGETS = [
  { dir: "img", width: 480 }, // 홈 프로필 사진 최대 240px
  { dir: "projects", width: 1200 }, // 포트폴리오 화면 이미지 최대 약 600px
  { dir: "logos", width: 192 }, // 회사 로고 48px
  { dir: "blog/naver", width: 720 }, // Log 글 썸네일 최대 약 360px
];

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (/\.(png|jpe?g)$/i.test(e.name)) yield p;
  }
}

const rows = [];
for (const { dir, width } of TARGETS) {
  const src = join(PUBLIC, dir);
  try { await stat(src); } catch { continue; }
  for await (const file of walk(src)) {
    const rel = relative(PUBLIC, file);
    const out = join(OUT, rel.slice(0, -extname(rel).length) + ".webp");
    const [s, o] = await Promise.all([stat(file), stat(out).catch(() => null)]);
    if (o && o.mtimeMs >= s.mtimeMs) continue;
    await mkdir(dirname(out), { recursive: true });
    await sharp(file).resize({ width, withoutEnlargement: true }).webp({ quality: 80 }).toFile(out);
    rows.push([rel, s.size, (await stat(out)).size]);
  }
}
const kb = (n) => `${(n / 1024).toFixed(1)}KB`;
for (const [rel, a, b] of rows) console.log(`[img] ${rel}  ${kb(a)} → ${kb(b)}`);
console.log(`[img] ${rows.length}개 변환 (변경 없는 파일은 건너뜀)`);
