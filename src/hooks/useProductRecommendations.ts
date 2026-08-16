import { useCallback, useState } from 'react';
import { api } from '../api/client';
import type { ProductRecommendation } from '../types/product';

export function useProductRecommendations() {
  const [recommendations, setRecommendations] = useState<ProductRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.getProductRecommendations();
      setRecommendations(
        response.products.map((product) => ({
          id: String(product.id),
          name: product.name,
          imageUrl: product.imageUrl,
          productUrl: product.detailUrl,
        })),
      );
    } catch (caught) {
      setRecommendations([]);
      setError(caught instanceof Error ? caught.message : '추천 상품을 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setRecommendations([]);
    setError(null);
    setIsLoading(false);
  }, []);

  return { recommendations, isLoading, error, refresh, clear };
}
