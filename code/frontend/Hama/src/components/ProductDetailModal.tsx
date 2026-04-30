import { useEffect, useId, useState } from 'react';
import {
  Bot,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Heart,
  X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../types/product';
import { hairline } from '../styles/hairline';
import { formatWon } from '../utils/format';
import { PriceInsightChart } from './PriceInsightChart';
import { ProductVisual } from './ProductVisual';

type ProductDetailModalProps = {
  product: Product | null;
  onClose: () => void;
};

// TODO(BE): 상세 API가 준비되면 product.platform + product.pid로 GET /api/products/:platform/:pid를 호출합니다.
// 카드 목록에는 가벼운 정보만 두고, description/images/priceHistory는 상세 응답으로 채우는 흐름이 좋습니다.
export function ProductDetailModal({
  product,
  onClose,
}: ProductDetailModalProps) {
  const titleId = useId();
  const navigate = useNavigate();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isWished, setIsWished] = useState(false);
  const [isWishToastVisible, setIsWishToastVisible] = useState(false);

  useEffect(() => {
    if (!product) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, product]);

  useEffect(() => {
    if (!isWishToastVisible) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setIsWishToastVisible(false);
    }, 3200);

    return () => window.clearTimeout(timeoutId);
  }, [isWishToastVisible]);

  if (!product) {
    return null;
  }

  const hasMultipleImages = product.images.length > 1;
  const latestImageIndex = product.images.length - 1;
  const activeImageUrl = resolveImageUrl(
    product.images[activeImageIndex] ?? product.imageUrl
  );
  const previousImageUrl = resolveImageUrl(
    product.images[activeImageIndex === 0 ? latestImageIndex : activeImageIndex - 1]
  );
  const nextImageUrl = resolveImageUrl(
    product.images[activeImageIndex === latestImageIndex ? 0 : activeImageIndex + 1]
  );

  const moveImage = (direction: 'prev' | 'next') => {
    setActiveImageIndex((current) => {
      if (direction === 'prev') {
        return current === 0 ? latestImageIndex : current - 1;
      }

      return current === latestImageIndex ? 0 : current + 1;
    });
  };

  const handleWishToggle = () => {
    setIsWished((current) => {
      const nextValue = !current;
      setIsWishToastVisible(nextValue);

      return nextValue;
    });
  };

  const goToWishlist = () => {
    setIsWishToastVisible(false);
    onClose();
    navigate('/mypage');
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-white/48 px-5 py-8 backdrop-blur-[8px]"
      role="presentation"
      onMouseDown={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`relative max-h-[calc(100vh-72px)] w-full max-w-[1500px] overflow-hidden rounded-[24px] ${hairline.panel}`}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          aria-label="상품 상세 팝업 닫기"
          onClick={onClose}
          className={`absolute right-6 top-6 z-20 flex h-11 w-11 items-center justify-center rounded-full text-gray-900 ${hairline.secondaryButton} ${hairline.focus}`}
        >
          <X className="h-5 w-5" strokeWidth={2.2} aria-hidden="true" />
        </button>

        <div className="grid max-h-[calc(100vh-72px)] grid-cols-1 items-stretch overflow-y-auto lg:grid-cols-[1.08fr_0.92fr]">
          <div className="flex h-full flex-col border-b border-[#C9CFDA] p-6 lg:border-b-0 lg:border-r lg:p-7">
            <div className={`relative h-[58vh] min-h-[520px] max-h-[670px] overflow-hidden rounded-[20px] ${hairline.image}`}>
              <span className={`absolute left-6 top-6 z-20 px-5 py-2.5 text-base ${hairline.status}`}>
                {product.status}
              </span>

              {hasMultipleImages ? (
                <>
                  <div className="absolute -left-16 top-10 bottom-10 w-28 overflow-hidden rounded-[18px] opacity-60">
                    <ProductVisual
                      imageUrl={previousImageUrl}
                      name={product.name}
                      variant="thumb"
                      isMuted
                    />
                  </div>
                  <div className="absolute -right-16 top-10 bottom-10 w-28 overflow-hidden rounded-[18px] opacity-60">
                    <ProductVisual
                      imageUrl={nextImageUrl}
                      name={product.name}
                      variant="thumb"
                      isMuted
                    />
                  </div>
                </>
              ) : null}

              <div
                key={`${activeImageIndex}-${activeImageUrl ?? 'fallback'}`}
                className="h-full animate-image-slide"
              >
                <ProductVisual
                  imageUrl={activeImageUrl}
                  name={product.name}
                  variant="modal"
                />
              </div>

              {hasMultipleImages ? (
                <>
                  <button
                    type="button"
                    aria-label="이전 상품 이미지"
                    onClick={() => moveImage('prev')}
                    className={`absolute left-5 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full transition duration-200 hover:scale-105 active:scale-95 ${hairline.primaryButton} focus:outline-none focus:ring-2 focus:ring-white`}
                  >
                    <ChevronLeft className="h-6 w-6" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    aria-label="다음 상품 이미지"
                    onClick={() => moveImage('next')}
                    className={`absolute right-5 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full transition duration-200 hover:scale-105 active:scale-95 ${hairline.primaryButton} focus:outline-none focus:ring-2 focus:ring-white`}
                  >
                    <ChevronRight className="h-6 w-6" aria-hidden="true" />
                  </button>
                </>
              ) : null}
            </div>

            <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
              {product.images.map((imageId, index) => (
                <button
                  type="button"
                  key={`${imageId}-${index}`}
                  aria-label={`${index + 1}번 상품 이미지 보기`}
                  onClick={() => setActiveImageIndex(index)}
                  className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 bg-[#F5F5F7] transition focus:outline-none focus:ring-2 focus:ring-black ${
                    index === activeImageIndex
                      ? 'border-black shadow-sm'
                      : 'border-[#C9CFDA] opacity-70 hover:opacity-100'
                  }`}
                >
                  <ProductVisual
                    imageUrl={resolveImageUrl(imageId)}
                    name={`${product.name} 썸네일 ${index + 1}`}
                    variant="thumb"
                  />
                </button>
              ))}
            </div>

            <a
              href={product.link}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex h-16 w-full items-center justify-center gap-2.5 rounded-xl border border-emerald-600/20 bg-emerald-600 px-5 text-lg font-black text-white shadow-[0_10px_24px_rgba(5,150,105,0.14)] transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2"
            >
              {product.platform}에서 보기
              <ExternalLink className="h-5 w-5" aria-hidden="true" />
            </a>
          </div>

          <div className="flex h-full min-h-[760px] flex-col p-8 lg:px-9 lg:py-7">
            <div className="pr-12">
              <h2
                id={titleId}
                className="text-2xl font-black leading-snug tracking-tight text-gray-950"
              >
                {product.name}
              </h2>
              <div className="mt-3 flex flex-wrap items-end gap-3">
                <p className="text-3xl font-black tracking-tight text-blue-600">
                  {formatWon(product.price)}
                </p>
                <span className="mb-1 rounded-full bg-gray-100 px-3.5 py-1.5 text-sm font-bold text-[#86868B]">
                  {formatWrittenDate(product.date)} 작성
                </span>
              </div>
            </div>

            <div className="mt-7">
              <h3 className="text-base font-black tracking-tight text-gray-900">
                상품 설명
              </h3>
              <p className="mt-3 text-[17px] font-semibold leading-8 text-gray-700">
                {product.description}
              </p>
            </div>

            <div className="mt-auto pt-12">
              <PriceInsightChart
                points={product.priceHistory}
                currentPrice={product.price}
              />
            </div>

            <div className="pt-8">
              <div className="h-px w-full bg-[#C9CFDA]" />
              <div className="mt-5 grid grid-cols-[1fr_64px] gap-3">
                <button
                  type="button"
                  className={`inline-flex h-16 min-h-16 items-center justify-center gap-2.5 rounded-xl px-5 text-lg font-black transition ${hairline.primaryButton} ${hairline.focus}`}
                >
                  <Bot className="h-5 w-5" aria-hidden="true" />
                  살래말래 AI
                </button>
                <button
                  type="button"
                  aria-label={isWished ? '찜 해제하기' : '찜하기'}
                  onClick={handleWishToggle}
                  className={`inline-flex h-16 min-h-16 w-16 min-w-16 items-center justify-center rounded-xl border text-sm font-black transition focus:outline-none focus:ring-2 focus:ring-rose-300 focus:ring-offset-2 ${
                    isWished
                      ? 'border-rose-300 bg-rose-50 text-rose-600'
                      : 'border-[#C9CFDA] bg-white text-rose-500 hover:bg-rose-50'
                  }`}
                  aria-pressed={isWished}
                >
                  <Heart
                    className={isWished ? 'h-6 w-6 fill-current' : 'h-6 w-6'}
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {isWishToastVisible ? (
        <div
          role="status"
          aria-live="polite"
          onMouseDown={(event) => event.stopPropagation()}
          className={`fixed bottom-8 left-1/2 z-[130] flex w-[min(520px,calc(100vw-48px))] -translate-x-1/2 items-center justify-between gap-4 rounded-2xl px-5 py-4 ${hairline.panel}`}
        >
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-500">
              <Heart className="h-5 w-5 fill-current" aria-hidden="true" />
            </span>
            <p className="truncate text-base font-black text-gray-900">
              찜 목록에 추가되었습니다
            </p>
          </div>
          <button
            type="button"
            onClick={goToWishlist}
            className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-black transition ${hairline.primaryButton} ${hairline.focus}`}
          >
            보러가기
          </button>
        </div>
      ) : null}
    </div>
  );
}

function resolveImageUrl(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  return value.startsWith('http') || value.startsWith('/') ? value : null;
}

function formatWrittenDate(value: string): string {
  const cleanedDate = value.replace(/\s*최신$/, '').trim();
  const hasTime = /\d{2}:\d{2}/.test(cleanedDate);

  return hasTime ? cleanedDate : `${cleanedDate} 14:30`;
}
