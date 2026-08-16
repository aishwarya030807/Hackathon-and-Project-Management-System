import { ChevronDown, X, SlidersHorizontal } from 'lucide-react';
import { useState, type ReactNode } from 'react';

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterGroup {
  label: string;
  key: string;
  options: FilterOption[];
}

export function FilterBar({
  groups,
  values,
  onChange,
  sortOptions,
  sortValue,
  onSortChange,
}: {
  groups: FilterGroup[];
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
  sortOptions?: FilterOption[];
  sortValue?: string;
  onSortChange?: (v: string) => void;
}) {
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const activeCount = Object.values(values).filter((v) => v && v !== 'all').length;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1.5 text-xs text-soft shrink-0">
        <SlidersHorizontal className="w-3.5 h-3.5" />
        Filters
      </div>

      {groups.map((group) => (
        <div key={group.key} className="relative">
          <button
            onClick={() => setOpenGroup(openGroup === group.key ? null : group.key)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
              values[group.key] && values[group.key] !== 'all'
                ? 'border-accent-500/30 bg-accent-500/10 text-accent-500'
                : 'border-base bg-elev text-soft hover:border-strong hover:text-base'
            }`}
          >
            {group.label}
            {values[group.key] && values[group.key] !== 'all' && (
              <span className="text-faint">: {values[group.key]}</span>
            )}
            <ChevronDown className="w-3 h-3" />
          </button>
          {openGroup === group.key && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setOpenGroup(null)} />
              <div className="absolute top-full mt-1 left-0 z-40 min-w-[180px] bg-elev border border-base rounded-xl shadow-float animate-scale-in overflow-hidden">
                <div className="py-1 max-h-60 overflow-y-auto">
                  <button
                    onClick={() => {
                      onChange(group.key, 'all');
                      setOpenGroup(null);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs hover:bg-soft transition-colors ${
                      (!values[group.key] || values[group.key] === 'all') ? 'text-accent-500 font-medium' : 'text-soft'
                    }`}
                  >
                    All {group.label}
                  </button>
                  {group.options.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        onChange(group.key, opt.value);
                        setOpenGroup(null);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs hover:bg-soft transition-colors ${
                        values[group.key] === opt.value ? 'text-accent-500 font-medium' : 'text-soft'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      ))}

      {activeCount > 0 && (
        <button
          onClick={() => {
            Object.keys(values).forEach((k) => onChange(k, 'all'));
          }}
          className="flex items-center gap-1 text-xs text-faint hover:text-error-500 transition-colors"
        >
          <X className="w-3 h-3" /> Clear ({activeCount})
        </button>
      )}

      {sortOptions && (
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-faint">Sort by</span>
          <select
            value={sortValue}
            onChange={(e) => onSortChange?.(e.target.value)}
            className="text-xs bg-elev border border-base rounded-lg px-3 py-2 text-soft focus:outline-none focus:border-accent-500 cursor-pointer"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
