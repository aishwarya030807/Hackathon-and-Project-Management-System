import { Search } from 'lucide-react';

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-faint pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 text-sm bg-elev border border-base rounded-xl text-base placeholder:text-faint focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 transition-all"
      />
    </div>
  );
}
