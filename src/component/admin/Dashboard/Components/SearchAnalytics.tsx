// app/dashboard/Components/SearchAnalytics.tsx
import type { TopKeyword } from "@/lib/api/actions/dashboard";

interface Props {
  keywords: TopKeyword[];
}

export default function SearchAnalytics({ keywords }: Props) {
  if (!keywords?.length) {
    return (
      <div className="py-8 text-center text-sm text-gray-400">
        No search data for this period
      </div>
    );
  }

  const maxSearches = Math.max(...keywords.map((k) => k.searches), 1);

  return (
    <div className="space-y-4">
      {keywords.map((kw, index) => (
        <div key={kw.keyword}>
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs font-medium text-gray-400 w-4 shrink-0">
                {index + 1}
              </span>
              <span className="text-sm font-medium text-gray-800 truncate">
                {kw.keyword}
              </span>
            </div>
            <div className="flex items-center gap-3 shrink-0 ml-2">
              <span className="text-xs text-gray-500">
                {kw.searches.toLocaleString()}
              </span>
              <span
                className={`text-xs font-semibold ${
                  kw.conversionRate >= 4
                    ? "text-emerald-600"
                    : kw.conversionRate >= 2
                      ? "text-amber-600"
                      : "text-gray-400"
                }`}
              >
                {kw.conversionRate}%
              </span>
            </div>
          </div>

          {/* Search volume bar */}
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-400 rounded-full transition-all"
              style={{ width: `${(kw.searches / maxSearches) * 100}%` }}
            />
          </div>
        </div>
      ))}

      <p className="text-xs text-gray-400 pt-1">
        % = conversion rate · bar = relative search volume
      </p>
    </div>
  );
}
