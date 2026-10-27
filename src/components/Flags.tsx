// 언어 전환용 국기 (SVG) - 국기 이모지는 윈도우에서 'KR' · 'US' 글자로 보여서 그림으로 직접 그림
// 작은 크기(약 24x16)에서 알아볼 수 있게 단순화: 태극기는 태극 + 괘 4개, 성조기는 줄 13개 + 파란 칸

export function KoreaFlag({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 24" className={className} aria-hidden="true">
      <rect width="36" height="24" fill="#fff" />
      {/* 태극 - 위 빨강, 아래 파랑(작은 반원 두 개로 S자) */}
      <g transform="translate(18 12) rotate(33.7)">
        <path d="M-6 0a6 6 0 0 1 12 0z" fill="#cd2e3a" />
        <path d="M-6 0a6 6 0 0 0 12 0z" fill="#0047a0" />
        <circle cx="-3" cy="0" r="3" fill="#cd2e3a" />
        <circle cx="3" cy="0" r="3" fill="#0047a0" />
      </g>
      {/* 괘(건 · 곤 · 감 · 리)를 굵은 막대로 단순화 */}
      <g fill="#000">
        <g transform="translate(7 5) rotate(-56.3)">
          <rect x="-3" y="-2.2" width="6" height="1" />
          <rect x="-3" y="-0.5" width="6" height="1" />
          <rect x="-3" y="1.2" width="6" height="1" />
        </g>
        <g transform="translate(29 19) rotate(-56.3)">
          <rect x="-3" y="-2.2" width="2.6" height="1" /><rect x="0.4" y="-2.2" width="2.6" height="1" />
          <rect x="-3" y="-0.5" width="2.6" height="1" /><rect x="0.4" y="-0.5" width="2.6" height="1" />
          <rect x="-3" y="1.2" width="2.6" height="1" /><rect x="0.4" y="1.2" width="2.6" height="1" />
        </g>
        <g transform="translate(29 5) rotate(56.3)">
          <rect x="-3" y="-2.2" width="2.6" height="1" /><rect x="0.4" y="-2.2" width="2.6" height="1" />
          <rect x="-3" y="-0.5" width="6" height="1" />
          <rect x="-3" y="1.2" width="2.6" height="1" /><rect x="0.4" y="1.2" width="2.6" height="1" />
        </g>
        <g transform="translate(7 19) rotate(56.3)">
          <rect x="-3" y="-2.2" width="6" height="1" />
          <rect x="-3" y="-0.5" width="2.6" height="1" /><rect x="0.4" y="-0.5" width="2.6" height="1" />
          <rect x="-3" y="1.2" width="6" height="1" />
        </g>
      </g>
    </svg>
  );
}

export function UsFlag({ className = "" }: { className?: string }) {
  const stripe = 24 / 13;
  return (
    <svg viewBox="0 0 36 24" className={className} aria-hidden="true">
      <rect width="36" height="24" fill="#fff" />
      {Array.from({ length: 7 }, (_, i) => (
        <rect key={i} y={i * 2 * stripe} width="36" height={stripe} fill="#b22234" />
      ))}
      <rect width="15.4" height={stripe * 7} fill="#3c3b6e" />
      {/* 별은 점으로 단순화(3줄) */}
      <g fill="#fff">
        {[2.2, 6.4, 10.6].flatMap((y) => [2.2, 5.9, 9.6, 13.3].map((x) => <circle key={`${x}-${y}`} cx={x} cy={y} r="0.9" />))}
      </g>
    </svg>
  );
}
