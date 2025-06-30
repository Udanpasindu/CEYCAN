import React, { useState, useEffect } from 'react';
import ProductPageLayout from '@/components/ProductPageLayout';
import { Wheat } from 'lucide-react';
import { getCategoryIdByName } from '@/utils/categoryRoutes';
import { getCategories, getCategory } from '@/services/api';
import { useProducts } from '@/hooks/useProducts';

const RiceGrainsPage = () => {
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [categoryData, setCategoryData] = useState<any>(null);
  const { products, loading } = useProducts(categoryId);
  
  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const categories = await getCategories();
        const id = getCategoryIdByName(categories, "Rice & Grains");
        if (id) {
          setCategoryId(id);
          // Get full category data to access the image
          const categoryDetails = await getCategory(id);
          setCategoryData(categoryDetails);
        }
      } catch (error) {
        console.error("Error fetching category data:", error);
      }
    };
    
    fetchCategoryData();
  }, []);

  return (
    <ProductPageLayout
      categoryName="Rice & Grains"
      categoryIcon={Wheat}
      description={categoryData?.description || ""}
      heroImage={categoryData?.image || "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=400&fit=crop"}
      products={products}
      isLoading={loading}
    />
  );
};

export default RiceGrainsPage;
