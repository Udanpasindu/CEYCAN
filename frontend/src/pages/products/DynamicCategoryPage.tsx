import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { slugToCategoryName } from '@/utils/categoryRoutes';
import ProductPageLayout from '@/components/ProductPageLayout';
import { Spinner } from '@/components/ui/spinner';
import { ChefHat, Wheat, Package, Apple, Droplets } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getCategories, queryKeys, Category } from '@/services/api';
import { useProducts } from '@/hooks/useProducts';
import NotFound from '@/pages/NotFound';

// Helper function to get category by slug
const getCategoryBySlug = (categories: Category[], slug: string): Category | undefined => {
  // First check if slug property exists, otherwise try to find a match by normalizing the name
  return categories.find(category => 
    // Check if slug property exists
    ('slug' in category && category.slug === slug) || 
    // Fallback: Convert category name to slug format and compare
    category.name.toLowerCase().replace(/\s+/g, '-') === slug
  );
};

// Helper function to get the appropriate icon component
const getIconComponent = (iconName?: string) => {
  switch (iconName?.toLowerCase()) {
    case 'chef':
    case 'chefhat':
      return ChefHat;
    case 'wheat':
    case 'grain':
      return Wheat;
    case 'package':
    case 'box':
      return Package;
    case 'apple':
    case 'fruit':
      return Apple;
    case 'droplets':
    case 'water':
      return Droplets;
    default:
      return Package;
  }
};

const DynamicCategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [notFound, setNotFound] = useState(false);
  const [category, setCategory] = useState<Category | null>(null);
  
  // Get categories from React Query
  const { 
    data: allCategories = [],
    isLoading: loadingCategories
  } = useQuery({
    queryKey: [queryKeys.categories],
    queryFn: () => getCategories(),
    staleTime: 1000 * 60, // 1 minute
  });
  
  // Find the category that matches the slug
  useEffect(() => {
    if (allCategories.length > 0 && slug) {
      const categoryMatch = getCategoryBySlug(allCategories, slug);
      
      if (!categoryMatch) {
        console.error(`No category found matching slug: ${slug}`);
        setNotFound(true);
        return;
      }
      
      if (!categoryMatch._id || typeof categoryMatch._id !== 'string') {
        console.error(`Invalid category ID for slug ${slug}:`, categoryMatch);
        setNotFound(true);
        return;
      }
      
      setCategory(categoryMatch);
    }
  }, [slug, allCategories]);
  
  // Use our updated hook once we have the category ID
  const { products, loading: loadingProducts } = useProducts(category?._id);
  
  // Loading state when we're fetching categories
  if (loadingCategories) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
        <span className="ml-3 text-xl">Loading {slug && slugToCategoryName(slug)} category...</span>
      </div>
    );
  }

  if (notFound || !category) {
    return <NotFound />;
  }

  const IconComponent = getIconComponent(category.icon);

  return (
    <>
      <ProductPageLayout
        categoryName={category.name}
        categoryIcon={IconComponent}
        description={category.description || ""}
        heroImage={category.image || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=400&fit=crop'}
        products={products}
        isLoading={loadingProducts}
      />
      
      {products.length === 0 && !loadingProducts && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <img src="/favicon.ico" alt="Ceycan Agro" className="h-16 w-16 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600">
            We're currently updating our collection of {category?.name?.toLowerCase() || 'products'}.<br />
            Please check back soon or contact us for more information.
          </p>
        </div>
      )}
    </>
  );
};

export default DynamicCategoryPage;