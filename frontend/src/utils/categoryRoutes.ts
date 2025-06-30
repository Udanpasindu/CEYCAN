import { Category } from '@/services/api';

/**
 * Convert category name to URL slug
 */
export const categoryToSlug = (categoryName: string): string => {
  return categoryName
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/--+/g, '-'); // Replace multiple hyphens with a single one
};

/**
 * Maps category names to their corresponding routes in the application
 */
export const categoryToRoute = (category: string | { name: string }): string => {
  const categoryName = typeof category === 'string' ? category : category.name;
  const formattedName = categoryName.toLowerCase().trim();
  
  const routes: { [key: string]: string } = {
    'rice & grains': '/products/rice-grains',
    'spices': '/products/spices',
    'pickles & snacks': '/products/pickles-snacks',
    'oil & ghee': '/products/oil-ghee',
    'seafood': '/products/seafood',
    'coconut products': '/products/coconut-products',
    'sugars & sweeteners': '/products/sugars-sweeteners',
    'soy products': '/products/soy-products',
    'specialty products': '/products/specialty-products'
  };
  
  return routes[formattedName] || `/products/${categoryToSlug(categoryName)}`;
};

/**
 * Generate a route for a category using its ID
 */
export const categoryToAdminRoute = (categoryId: string): string => {
  return `/admin/products?category=${categoryId}`;
};

/**
 * Gets the category ID by name from the categories array
 */
export const getCategoryIdByName = (categories: any[], name: string): string | undefined => {
  const searchName = name.toLowerCase();
  const category = categories.find(cat => {
    const catName = cat.name.toLowerCase();
    return catName === searchName || 
           catName.replace(' & ', ' and ') === searchName ||
           catName.replace(' and ', ' & ') === searchName;
  });
  return category?._id;
};

/**
 * Generate route from a category object (for admin panel)
 */
export const getCategoryRoute = (category: Category): string => {
  if (!category._id) return '/admin/products';
  return `/admin/products?category=${category._id}`;
};

/**
 * Get all category slugs from categories array
 */
export const getCategorySlugs = (categories: Category[]): string[] => {
  return categories.map(category => categoryToSlug(category.name));
};

/**
 * Find a category by its slug
 */
export const getCategoryBySlug = (categories: Category[], slug: string): Category | undefined => {
  return categories.find(category => categoryToSlug(category.name) === slug);
};

/**
 * Converts a slug back to a readable category name
 */
export const slugToCategoryName = (slug: string): string => {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
};
