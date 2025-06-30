import React, { useState, useEffect } from 'react';
import ProductPageLayout from '@/components/ProductPageLayout';
import { Wheat } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { getCategories, getCategory } from '@/services/api';
import { getCategoryIdByName } from '@/utils/categoryRoutes';
import { useProducts } from '@/hooks/useProducts';

const SoyProductsPage = () => {
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [categoryData, setCategoryData] = useState<any>(null);
  const { products, loading: isLoading, error } = useProducts(categoryId);
  
  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const categories = await getCategories();
        const id = getCategoryIdByName(categories, "Soy Products");
        if (id) {
          setCategoryId(id);
          // Get full category data to access the image
          const categoryDetails = await getCategory(id);
          setCategoryData(categoryDetails);
        }
      } catch (err) {
        console.error("Error fetching category data:", err);
      }
    };
    
    fetchCategoryData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading products...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-red-500">
        <p>Error: {error.message}</p>
      </div>
    );
  }

  return (
    <ProductPageLayout
      categoryName="Soy Products"
      categoryIcon={Wheat}
      description={categoryData?.description || ""}
      heroImage={categoryData?.image || "https://images.unsplash.com/photo-1581786685442-7b6fac9b8319?w=600&h=400&fit=crop"}
      products={products}
    />
  );
};

export default SoyProductsPage;
