// 빌드 전에 만든 이미지 목록(src/generated/images.json)에서 로딩 중 보여줄 흐린 미리보기를 꺼냄
import manifest from "@/generated/images.json";

type Entry = { blur: string };
const images = manifest as Record<string, Entry>;

export function blurOf(src: string): string | undefined {
  return images[src]?.blur;
}
