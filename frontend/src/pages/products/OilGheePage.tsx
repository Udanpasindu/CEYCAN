import React, { useState, useEffect } from 'react';
import ProductPageLayout from '@/components/ProductPageLayout';
import { Droplets } from 'lucide-react';
import { getProductsByCategory, getCategory, getCategories, Product, Category } from '@/services/api';
import { Loader2 } from 'lucide-react';

const OilGheePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // We'll find the category ID dynamically
  const CATEGORY_NAME = "Oil & Ghee";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // First get all categories and find the matching one by name
        const allCategories = await getCategories();
        const matchingCategory = allCategories.find(cat => 
          cat.name.toLowerCase() === CATEGORY_NAME.toLowerCase());
        
        if (!matchingCategory || !matchingCategory._id) {
          throw new Error(`Category "${CATEGORY_NAME}" not found`);
        }
        
        console.log(`Found category ID: ${matchingCategory._id}`);
        
        // Get the full category details to access the image
        const categoryDetails = await getCategory(matchingCategory._id);
        setCategory(categoryDetails);
        
        // Then get the products using the found category ID
        const productsData = await getProductsByCategory(matchingCategory._id);
        setProducts(productsData);
      } catch (err) {
        console.error('Data fetch error:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while fetching data');
        
        // Set default category data for UI display even if API fails
        setCategory({
          name: CATEGORY_NAME,
          description: "",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
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
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <ProductPageLayout
      categoryName={category?.name || "Oil & Ghee"}
      categoryIcon={Droplets}
      description={category?.description || ""}
      heroImage={category?.image || "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&h=400&fit=crop"}
      products={products}
    />
  );
};

export default OilGheePage;
