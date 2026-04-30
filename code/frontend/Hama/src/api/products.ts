import type { Product } from '../types/product';

export type SearchProductsParams = {
  query: string;
  platforms: string[];
  sort: 'low-price' | 'recent';
  page: number;
  limit: number;
};

export type SearchProductsResponse = {
  items: Product[];
  total: number;
  page: number;
  limit: number;
  summary: {
    lowestPrice: number;
    averagePrice: number;
    updatedAt: string;
  };
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

// TODO(BE): 백엔드 검색 API가 준비되면 SearchResultsPage의 mock 필터링을 이 함수 호출로 교체합니다.
// GET /api/products/search?q=아이폰&platforms=번개장터,중고나라&sort=low-price&page=1&limit=40
export async function fetchSearchProducts({
  query,
  platforms,
  sort,
  page,
  limit,
}: SearchProductsParams): Promise<SearchProductsResponse> {
  const params = new URLSearchParams({
    q: query,
    platforms: platforms.join(','),
    sort,
    page: String(page),
    limit: String(limit),
  });

  const response = await fetch(`${API_BASE_URL}/api/products/search?${params}`);

  if (!response.ok) {
    throw new Error('상품 검색 결과를 불러오지 못했습니다.');
  }

  return response.json() as Promise<SearchProductsResponse>;
}
