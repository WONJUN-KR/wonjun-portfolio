// 빌드 전에 public 이미지를 화면 크기별 WebP 로 줄여 public/_opt 에 만듦 (npm run build / dev 앞에서 자동 실행)
// Next 이미지 최적화는 요청 때마다 서버에서 하는 방식이라, 미리 여러 크기로 만들어 두고 next/image 의 사용자 정의 로더가 골라 씀
// - 크기별 파일: public/_opt/<경로>-<너비>.webp  (예: /_opt/projects/ocp-800.webp)
// - 목록: src/generated/images.json  (원본 크기 · 만든 너비들)
// 원본은 그대로 두고 결과물은 git 에 안 올림. 원본보다 새 결과가 있으면 다시 안 만듦
import { readdir, stat, mkdir, writeFile } from "node:fs/promises";
import { join, dirname, extname, relative } from "node:path";
import sharp from "sharp";

const PUBLIC = "public";
const OUT = join(PUBLIC, "_opt");
const MANIFEST = join("src", "generated", "images.json");
// 폴더별로 만들 너비 = 화면에 보이는 크기 1배·2배 정도 (폰·PC·레티나)
const TARGETS = [
  { dir: "img", widths: [240, 480] }, // 홈 프로필 96~240px
  { dir: "projects", widths: [400, 800, 1200] }, // 포트폴리오 화면 이미지 최대 약 600px
  { dir: "logos", widths: [96, 192] }, // 회사 로고 48px
  { dir: "blog/naver", widths: [320, 720] }, // Log 글 썸네일 약 160~360px
];

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (/\.(png|jpe?g)$/i.test(e.name)) yield p;
  }
}

const manifest = {};
let made = 0;
for (const { dir, widths } of TARGETS) {
  const src = join(PUBLIC, dir);
  try { await stat(src); } catch { continue; }
  for await (const file of walk(src)) {
    const rel = relative(PUBLIC, file);
    const key = "/" + rel.split("\\").join("/");
    const base = join(OUT, rel.slice(0, -extname(rel).length));
    const s = await stat(file);
    const meta = await sharp(file).metadata();
    // 원본보다 큰 너비는 안 만들고, 원본이 제일 작은 너비보다 작으면 원본 너비 하나만
    const ws = [...new Set(widths.map((w) => Math.min(w, meta.width)))];
    for (const w of ws) {
      const out = `${base}-${w}.webp`;
      const o = await stat(out).catch(() => null);
      if (o && o.mtimeMs >= s.mtimeMs) continue;
      await mkdir(dirname(out), { recursive: true });
      await sharp(file).resize({ width: w, withoutEnlargement: true }).webp({ quality: 80 }).toFile(out);
      made++;
    }
    manifest[key] = { width: meta.width, height: meta.height, widths: ws };
  }
}
await mkdir(dirname(MANIFEST), { recursive: true });
await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
console.log(`[img] 이미지 ${Object.keys(manifest).length}개 · 새로 만든 파일 ${made}개 (변경 없는 건 건너뜀)`);
