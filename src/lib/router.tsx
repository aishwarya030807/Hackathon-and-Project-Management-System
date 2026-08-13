import { useCallback, useSyncExternalStore } from 'react';

type Listener = () => void;
let listeners = new Set<Listener>();

function getCurrentPath() {
  return typeof window !== 'undefined' ? window.location.pathname : '/';
}

function getCurrentSearch() {
  return typeof window !== 'undefined' ? window.location.search : '';
}

function emit() {
  listeners.forEach((l) => l());
}

function setPath(path: string) {
  if (getCurrentPath() + getCurrentSearch() === path) return;
  window.history.pushState({}, '', path);
  emit();
  window.scrollTo({ top: 0 });
}

if (typeof window !== 'undefined') {
  window.addEventListener('popstate', () => {
    emit();
    window.scrollTo({ top: 0 });
  });
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useRoute() {
  return useSyncExternalStore(subscribe, getCurrentPath, () => '/');
}

export function navigate(path: string) {
  setPath(path);
}

export function useNavigate() {
  return useCallback((path: string) => setPath(path), []);
}

export function Link({
  to,
  children,
  className,
  onClick,
  ...rest
}: {
  to: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setPath(to);
    onClick?.();
  };
  return (
    <a href={to} onClick={handleClick} className={className} {...rest}>
      {children}
    </a>
  );
}

export function useParams(pattern: string): Record<string, string> {
  const rawPath = useRoute();
  const normalizedPath = rawPath.startsWith('/innovara/') 
    ? rawPath.replace(/^\/innovara/, '') 
    : (rawPath === '/innovara' ? '/' : rawPath);

  const testPaths = [rawPath, normalizedPath];
  for (const path of testPaths) {
    const keys: string[] = [];
    const regexStr = pattern.replace(/:([^/]+)/g, (_, key) => {
      keys.push(key);
      return '([^/]+)';
    });
    const match = new RegExp(`^${regexStr}$`).exec(path);
    if (match) {
      const params: Record<string, string> = {};
      keys.forEach((key, i) => {
        params[key] = decodeURIComponent(match[i + 1]);
      });
      return params;
    }
  }
  return {};
}

export function useQuery(): URLSearchParams {
  const search = useSyncExternalStore(subscribe, getCurrentSearch, () => '');
  return new URLSearchParams(search);
}
