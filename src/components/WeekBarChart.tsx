export interface WeekBarDay {
  label: string;
  value: number;
  isToday?: boolean;
}

interface WeekBarChartProps {
  days: WeekBarDay[];
  height?: number;
}

export function WeekBarChart({ days, height = 90 }: WeekBarChartProps) {
  const max = Math.max(1, ...days.map((d) => d.value));

  return (
    <div className="flex items-end gap-1.5" style={{ height }}>
      {days.map((d, i) => {
        const barHeight = Math.max(8, (d.value / max) * 100);
        return (
          <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
            <div className="flex w-full flex-1 items-end">
              <div
                className="w-full rounded-full transition-all"
                style={{
                  height: `${barHeight}%`,
                  backgroundColor: d.value > 0 ? 'var(--accent)' : 'rgba(255,255,255,0.14)',
                }}
              />
            </div>
            <span
              className="text-[10px] font-bold text-white/50"
              style={{ color: d.isToday ? 'var(--accent)' : undefined }}
            >
              {d.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
