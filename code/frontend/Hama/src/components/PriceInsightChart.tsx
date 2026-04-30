import type { PricePoint } from '../types/product';
import { hairline } from '../styles/hairline';
import { formatWon } from '../utils/format';

type PriceInsightChartProps = {
  points: PricePoint[];
  currentPrice: number;
};

const chartWidth = 420;
const chartHeight = 150;
const chartPadding = 20;

export function PriceInsightChart({
  points,
  currentPrice,
}: PriceInsightChartProps) {
  const prices = points.map((point) => point.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const averagePrice = Math.round(
    prices.reduce((sum, price) => sum + price, 0) / prices.length
  );
  const range = Math.max(maxPrice - minPrice, 1);

  const coordinates = points.map((point, index) => {
    const x =
      chartPadding +
      (index / Math.max(points.length - 1, 1)) * (chartWidth - chartPadding * 2);
    const y =
      chartPadding +
      ((maxPrice - point.price) / range) * (chartHeight - chartPadding * 2);

    return { ...point, x, y };
  });

  const linePath = coordinates
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');
  const areaPath = `${linePath} L ${
    coordinates[coordinates.length - 1]?.x ?? chartPadding
  } ${chartHeight - chartPadding} L ${chartPadding} ${
    chartHeight - chartPadding
  } Z`;
  const latest = coordinates[coordinates.length - 1];
  const previous = coordinates[coordinates.length - 2];
  const changeRate = previous
    ? ((currentPrice - previous.price) / previous.price) * 100
    : 0;

  return (
    <section className={`rounded-2xl p-5 ${hairline.panelSoft}`}>
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="text-sm font-bold tracking-tight text-gray-900">
            가격 인사이트
          </h3>
          <p className="mt-1 text-xs font-medium text-[#86868B]">
            최근 가격 기준 mock 추이
          </p>
        </div>
        <div className="rounded-full border border-[#C9CFDA] bg-white px-3 py-1 text-xs font-bold text-blue-700 shadow-sm">
          최근 7일 {changeRate.toFixed(1)}%
        </div>
      </div>

      <div className="relative">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-[150px]"
          role="img"
          aria-label="최근 가격 추이 그래프"
        >
          <defs>
            <linearGradient id="price-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#2563EB" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0, 1, 2].map((line) => {
            const y =
              chartPadding +
              (line / 2) * (chartHeight - chartPadding * 2);

            return (
              <line
                key={line}
                x1={chartPadding}
                x2={chartWidth - chartPadding}
                y1={y}
                y2={y}
                stroke="#E5E7EB"
                strokeDasharray="4 6"
              />
            );
          })}
          <path d={areaPath} fill="url(#price-fill)" />
          <path
            d={linePath}
            fill="none"
            stroke="#2563EB"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {coordinates.map((point) => (
            <circle
              key={point.label}
              cx={point.x}
              cy={point.y}
              r="4.5"
              fill="#FFFFFF"
              stroke="#2563EB"
              strokeWidth="3"
            />
          ))}
          {latest ? (
            <>
              <line
                x1={latest.x}
                x2={latest.x}
                y1={chartPadding}
                y2={chartHeight - chartPadding}
                stroke="#111827"
                strokeOpacity="0.16"
                strokeDasharray="3 5"
              />
              <circle
                cx={latest.x}
                cy={latest.y}
                r="7"
                fill="#22C55E"
                stroke="#FFFFFF"
                strokeWidth="4"
              />
            </>
          ) : null}
        </svg>

        {latest ? (
          <div className="absolute right-2 top-2 rounded-xl border border-[#C9CFDA] bg-white px-3 py-2 shadow-[0_10px_24px_rgba(29,29,31,0.06)]">
            <p className="text-[11px] font-bold text-[#86868B]">현재가</p>
            <p className="text-sm font-black text-gray-900">
              {formatWon(latest.price)}
            </p>
          </div>
        ) : null}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <InsightChip label="최저가" value={formatWon(minPrice)} tone="green" />
        <InsightChip label="평균가" value={formatWon(averagePrice)} />
        <InsightChip label="현재가" value={formatWon(currentPrice)} tone="blue" />
      </div>
    </section>
  );
}

type InsightChipProps = {
  label: string;
  value: string;
  tone?: 'green' | 'blue';
};

function InsightChip({ label, value, tone }: InsightChipProps) {
  const toneClass =
    tone === 'green'
      ? 'text-emerald-700 bg-emerald-50'
      : tone === 'blue'
        ? 'text-blue-700 bg-blue-50'
        : 'text-gray-700 bg-white';

  return (
    <div className={`rounded-xl border border-[#C9CFDA] px-3 py-2 ${toneClass}`}>
      <p className="text-[11px] font-bold opacity-70">{label}</p>
      <p className="mt-0.5 text-xs font-black tracking-tight">{value}</p>
    </div>
  );
}
