// Velog 글 본문 전처리 - react-markdown 은 HTML 을 그리지 않고 글자로 보여주므로(안전 기본값),
// 크기 조절용으로 쓴 <img src="..." width="..."> 를 마크다운 이미지 ![](...) 로 바꿔서 그림이 보이게 함
const IMG_TAG = /<img\b[^>]*?\bsrc\s*=\s*["']([^"']+)["'][^>]*>/gi;
const ALT_ATTR = /\balt\s*=\s*["']([^"']*)["']/i;

export function normalizePostMarkdown(content: string): string {
  return content.replace(IMG_TAG, (tag, src: string) => {
    const alt = tag.match(ALT_ATTR)?.[1] ?? "";
    return `![${alt}](${src})`;
  });
}
