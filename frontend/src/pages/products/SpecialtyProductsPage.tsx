import React, { useState, useEffect } from 'react';
import ProductPageLayout from '@/components/ProductPageLayout';
import { ChefHat } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { getCategories, getCategory } from '@/services/api';
import { getCategoryIdByName } from '@/utils/categoryRoutes';
import { useProducts } from '@/hooks/useProducts';

const SpecialtyProductsPage = () => {
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [categoryData, setCategoryData] = useState<any>(null);
  const { products, loading: isLoading, error } = useProducts(categoryId);
  
  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const categories = await getCategories();
        const id = getCategoryIdByName(categories, "Specialty Products");
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

  // Show loading state when fetching products
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading products...</span>
      </div>
    );
  }

  // Show error message if there's an error
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-red-500">
        <p>Error: {error.message}</p>
      </div>
    );
  }

  // Use hardcoded products only if API didn't return any
  const displayProducts = products.length > 0 ? products : [
    {
      name: "Ceylon Tea",
      description: "Premium Ceylon tea with distinctive flavor and aroma from high-grown estates.",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      price: "From $20/kg",
      inStock: true
    },
    {
      name: "Cashew Nuts",
      description: "Premium whole cashew nuts processed to perfection.",
      image: "https://images.unsplash.com/photo-1535961652354-923cb08225a7?w=400&h=300&fit=crop",
      price: "From $30/kg",
      inStock: true
    },
    {
      name: "Vanilla Extract",
      description: "Pure vanilla extract from locally grown vanilla beans.",
      image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop",
      price: "From $45/bottle",
      inStock: true
    },
    {
      name: "Moringa Powder",
      description: "Nutrient-rich moringa leaf powder with superfood properties.",
      image: "https://images.unsplash.com/photo-1617113227675-6e5b90f6d7dd?w=400&h=300&fit=crop",
      price: "From $18/kg",
      inStock: true
    },
    {
      name: "Curry Leaves",
      description: "Fresh and dried curry leaves for authentic Sri Lankan flavoring.",
      image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&h=300&fit=crop",
      price: "From $12/kg",
      inStock: true
    },
    {
      name: "King Coconut Water",
      description: "Premium king coconut water with natural electrolytes.",
      image: "https://images.unsplash.com/photo-1519678015935-8de2e1d6ad0b?w=400&h=300&fit=crop",
      price: "From $4/bottle",
      inStock: true
    }
  ];

  return (
    <ProductPageLayout
      categoryName="Specialty Products"
      categoryIcon={ChefHat}
      description={categoryData?.description || ""}
      heroImage={categoryData?.image || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop"}
      products={displayProducts}
      isLoading={isLoading}
    />
  );
};

export default SpecialtyProductsPage;
