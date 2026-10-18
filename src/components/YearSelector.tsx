"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Props = {
  paramName?: string;
  years: number[];
  defaultLabel?: string;
};

export default function YearSelector({
  paramName = "year",
  years,
  defaultLabel = "최근 6개월",
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get(paramName) ?? "";

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    if (e.target.value) {
      params.set(paramName, e.target.value);
    } else {
      params.delete(paramName);
    }
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  return (
    <select
      value={current}
      onChange={onChange}
      className="text-xs bg-surface border border-line rounded-full px-3 py-1 text-foreground"
    >
      <option value="">{defaultLabel}</option>
      {years.map((y) => (
        <option key={y} value={y}>
          {y}년
        </option>
      ))}
    </select>
  );
}
