import { useState, useRef, useEffect } from 'react';

interface SearchBarProps {
  value?: string;
  onSearch: (query: string) => void;
  autoFocus?: boolean;
  placeholder?: string;
}

export function SearchBar({
  value = '',
  onSearch,
  autoFocus = false,
  placeholder = '想吃点什么...',
}: SearchBarProps) {
  const [inputValue, setInputValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleChange = (newValue: string) => {
    setInputValue(newValue);
    clearTimeout(debounceTimer.current ?? undefined);
    debounceTimer.current = setTimeout(() => {
      onSearch(newValue);
    }, 300);
  };

  return (
    <div className="relative w-full search-bar-shadow search-input rounded-2xl bg-white">
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(event) => handleChange(event.target.value)}
        placeholder={placeholder}
        className="w-full h-14 pl-5 pr-14 bg-transparent text-[15px] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] outline-none"
      />
      {/* 搜索图标在右侧 */}
      {inputValue ? (
        <button
          onClick={() => handleChange('')}
          className="absolute right-5 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] cursor-pointer"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      ) : (
        <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
        </div>
      )}
    </div>
  );
}
