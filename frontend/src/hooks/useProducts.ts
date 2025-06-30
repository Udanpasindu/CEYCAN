import { useQuery } from '@tanstack/react-query';
import { Product, getProductsByCategory, queryKeys } from '@/services/api';

export const useProducts = (categoryId?: string) => {
  const {
    data: products = [],
    isLoading: loading,
    error,
    refetch
  } = useQuery({
    queryKey: categoryId ? [queryKeys.productsByCategory(categoryId)] : [queryKeys.products, 'empty'],
    queryFn: () => categoryId ? getProductsByCategory(categoryId) : Promise.resolve([]),
    enabled: !!categoryId && categoryId.match(/^[a-f\d]{24}$/i) !== null,
    staleTime: 1000 * 60, // 1 minute
  });

  return { products, loading, error, refetch };
};

