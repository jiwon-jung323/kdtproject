import { useState } from 'react';
import type { FormEvent } from 'react';
import { Clock, Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { hairline } from '../styles/hairline';

type SearchBarProps = {
  isOpen: boolean;
  initialQuery?: string;
  onOpen: () => void;
  onClose: () => void;
};

// TODO(BE): 로그인 기반 최근 검색어가 필요하면 GET/DELETE /api/users/me/recent-searches로 교체합니다.
// 비로그인 상태는 localStorage에 저장해도 충분합니다.
const recentKeywords = ['맥북 air', '나이키 조던', '캠핑 텐트'];

export function SearchBar({
  isOpen,
  initialQuery = '',
  onOpen,
  onClose,
}: SearchBarProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState(initialQuery);

  const runSearch = (nextQuery: string) => {
    const trimmedQuery = nextQuery.trim();

    if (!trimmedQuery) {
      return;
    }

    onClose();
    navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    runSearch(query);
  };

  return (
    <section
      role="search"
      aria-label="상품 검색"
      className="w-full pt-8 pb-0 relative z-[70]"
    >
      {isOpen ? (
        <div
          className="fixed inset-0 z-[60]"
          onClick={onClose}
          aria-hidden="true"
        />
      ) : null}

      <div className="max-w-[1440px] mx-auto px-8">
        <div className="w-full max-w-[940px] mx-auto relative">
          <form className="relative z-[75]" onSubmit={handleSubmit}>
            <label htmlFor="main-search" className="sr-only">
              검색어 입력
            </label>
            <div
              className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none"
              aria-hidden="true"
            >
              <Search className="w-5 h-5 text-[#8B919B]" />
            </div>
            <input
              id="main-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onFocus={onOpen}
              placeholder="어떤 상품의 최저가를 찾으시나요?"
              aria-autocomplete="list"
              aria-expanded={isOpen}
              aria-controls={isOpen ? 'search-popup' : undefined}
              className="h-[72px] w-full rounded-[25px] border border-[#C6CDD8] bg-white/86 py-0 pl-12 pr-[118px] text-lg font-black text-gray-950 shadow-[0_12px_34px_rgba(29,29,31,0.035),inset_0_1px_0_rgba(255,255,255,0.92)] transition-all placeholder:text-black/36 focus:border-black focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button
              type="submit"
              className={`absolute right-2.5 top-1/2 inline-flex h-[50px] min-w-[92px] -translate-y-1/2 items-center justify-center rounded-[18px] px-4 text-[15px] font-black transition-colors ${hairline.primaryButton} ${hairline.focus}`}
            >
              검색
            </button>
          </form>

          {isOpen ? (
            <div
              id="search-popup"
              className={`relative z-[75] mt-3 w-full overflow-hidden rounded-[24px] ${hairline.panel}`}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold tracking-tight text-gray-900">
                    최근 검색어
                  </h3>
                  <button
                    className="text-xs font-bold text-[#86868B] hover:text-black transition-colors focus:outline-none focus:underline"
                    aria-label="최근 검색어 전체 삭제"
                  >
                    전체 삭제
                  </button>
                </div>
                <ul className="space-y-1" aria-label="최근 검색어 목록">
                  {recentKeywords.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-4 p-3 hover:bg-white rounded-xl transition-colors"
                    >
                      <Clock
                        className="w-4 h-4 text-gray-400"
                        aria-hidden="true"
                      />
                      <button
                        type="button"
                        onClick={() => runSearch(item)}
                        className="text-base font-medium text-gray-700 text-left flex-1 focus:outline-none focus:underline"
                      >
                        {item}
                      </button>
                      <button
                        type="button"
                        aria-label={`${item} 검색어 삭제`}
                        className="ml-auto text-gray-300 hover:text-gray-600 transition-colors p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                      >
                        <X className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
