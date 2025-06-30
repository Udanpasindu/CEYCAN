import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Spinner } from "@/components/ui/spinner";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Package, 
  Search,
  ChefHat,
  Wheat,
  Apple,
  Droplets
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/services/api';
import type { Category } from '@/services/api';
import { useNavigate } from 'react-router-dom';
import { getCategoryRoute } from '@/utils/categoryRoutes';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Helper function to map icon string to component
const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case 'ChefHat': return ChefHat;
    case 'Wheat': return Wheat;
    case 'Apple': return Apple;
    case 'Droplets': return Droplets;
    case 'Package': return Package;
    default: return ChefHat;
  }
};

const Categories = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirmingDeleteAll, setIsConfirmingDeleteAll] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Simple form state without React Query
  const [formData, setFormData] = useState<Omit<Category, '_id' | 'products' | 'status'>>({
    name: '',
    description: '',
    icon: 'ChefHat',
    image: ''
  });

  // Direct function to fetch categories (just like ProductsByCategory)
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
      setError(null);
      console.log('Categories refreshed:', data.length, 'items');
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories. Please try again.');
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load categories. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Use exact same pattern as ProductsByCategory
  useEffect(() => {
    fetchCategories();
  }, []);

  // Add a side effect to force refresh after dialog operations
  useEffect(() => {
    // When dialog closes and we were editing, force a refresh
    if (!isDialogOpen && editingCategory) {
      console.log('Dialog closed after editing, forcing refresh');
      setTimeout(() => {
        fetchCategories();
      }, 200);
    }
  }, [isDialogOpen, editingCategory]);

  // COMPLETELY REWRITTEN handleSubmit function to match ProductsByCategory.tsx exactly
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      if (editingCategory && editingCategory._id) {
        // Store category ID for later reference
        const editedCategoryId = editingCategory._id;
        console.log(`Updating category ${editedCategoryId} with data:`, formData);
        
        // Update on server
        const updatedCategory = await updateCategory(editedCategoryId, formData);
        console.log('Server returned updated category:', updatedCategory);
        
        // First update local state
        setCategories(prevCategories => 
          prevCategories.map(cat => 
            cat._id === editedCategoryId ? updatedCategory : cat
          )
        );
        
        toast({
          title: "Category Updated",
          description: `${formData.name} has been updated successfully.`,
        });
        
        // Force a refresh AFTER updating
        setTimeout(() => {
          console.log('Forcing refresh after category update');
          fetchCategories();
        }, 500);
      } else {
        // Create new category - no changes needed here
        const newCategory = await createCategory(formData);
        setCategories(prevCategories => [...prevCategories, newCategory]);
        toast({
          title: "Category Added",
          description: `${newCategory.name} has been added successfully.`,
        });
      }
    } catch (err) {
      console.error('Error saving category:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to save category. Please try again.",
      });
    }
    
    // Close dialog and reset form AFTER the operations are complete
    resetForm();
    setIsDialogOpen(false);
  };

  // Fix the handleEdit function to properly set up editing
  const handleEdit = (category: Category) => {
    console.log('Editing category:', category);
    
    // Make sure to include the _id in editingCategory
    setEditingCategory(category);
    
    // Make sure form data is properly populated
    setFormData({
      name: category.name || '',
      description: category.description || '',
      icon: category.icon || 'ChefHat',
      image: category.image || ''
    });
    
    setIsDialogOpen(true);
  };
  
  // Handle delete confirmation
  const handleDeleteConfirm = (id: string | undefined) => {
    if (!id) return;
    setConfirmDeleteId(id);
  };
  
  // Simplified delete function to match ProductsByCategory approach
  const handleDelete = async (id: string) => {
    if (!id) return;
    
    setIsDeleting(true);
    try {
      // Direct API call
      await deleteCategory(id);
      // Direct state update
      setCategories(categories.filter(cat => cat._id !== id));
      toast({
        title: "Category Deleted",
        description: "Category has been removed successfully.",
      });
      setConfirmDeleteId(null);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to delete category";
      let detailedMessage = errorMessage;
      let actionButton = null;
      
      if (errorMessage.includes("associated products")) {
        const categoryToView = categories.find(c => c._id === id);
        
        detailedMessage = "This category has associated products. You need to remove or reassign these products before deleting the category.";
        
        if (categoryToView) {
          actionButton = (
            <Button 
              className="mt-2 bg-blue-600 hover:bg-blue-700"
              onClick={() => navigate(`/admin/products?category=${id}`)}
            >
              View Associated Products
            </Button>
          );
        }
      }
      
      toast({
        variant: "destructive",
        title: "Unable to Delete Category",
        description: (
          <div className="space-y-2">
            <p>{detailedMessage}</p>
            {actionButton}
          </div>
        ),
        duration: 6000,
      });
      
      console.error("Delete operation failed:", error);
    } finally {
      setIsDeleting(false);
    }
  };
  
  // Handle bulk deletion
  const handleDeleteAll = async () => {
    setIsDeletingAll(true);
    try {
      // Filter categories without products
      const categoriesToDelete = categories.filter(c => !categoryHasProducts(c));
      
      if (categoriesToDelete.length === 0) {
        throw new Error("No categories available to delete. Categories with products cannot be deleted.");
      }
      
      // Track deleted IDs and errors
      const results = [];
      const deletedIds = [];
      const errors = [];
      
      // Delete categories one by one
      for (const category of categoriesToDelete) {
        if (!category._id) continue;
        
        try {
          await deleteCategory(category._id);
          deletedIds.push(category._id);
          results.push({ status: 'fulfilled', id: category._id });
        } catch (err) {
          errors.push(err);
          results.push({ status: 'rejected', id: category._id });
        }
      }
      
      // Update local state by removing deleted categories
      setCategories(prevCategories => 
        prevCategories.filter(cat => !deletedIds.includes(cat._id))
      );
      
      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;
      
      toast({
        title: "Categories Deleted",
        description: `Successfully deleted ${successful} out of ${categoriesToDelete.length} categories.${
          failed > 0 ? ` ${failed} categories could not be deleted.` : ''
        }`,
      });
      
      // Refresh to ensure we have latest data
      fetchCategories();
      
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Failed to delete categories. Please try again.";
      
      toast({
        variant: "destructive",
        title: "Error Deleting Categories",
        description: errorMessage,
      });
    } finally {
      setIsConfirmingDeleteAll(false);
      setIsDeletingAll(false);
    }
  };
  
  // Reset form
  const resetForm = () => {
    setFormData({ name: '', description: '', icon: 'ChefHat', image: '' });
    setEditingCategory(null);
  };
  
  // Helper function to check if a category has products
  const categoryHasProducts = (category: Category | null | undefined | {}): boolean => {
    return !!category && 'name' in category && typeof category.products === 'number' && category.products > 0;
  };
  
  // Helper function to get product count
  const getProductCount = (category: Category): number => {
    // If products is a number, return it
    if (typeof category.products === 'number') {
      return category.products;
    }
    // If products is an array, return its length
    else if (Array.isArray(category.products)) {
      // Use type assertion to tell TypeScript this is an array
      return (category.products as any[]).length;
    }
    // Default to 0 if no products data
    return 0;
  };

  // Filter categories based on search
  const filteredCategories = categories
    .filter(category =>
      (category?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (category?.description?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
        <span className="ml-2">Loading categories...</span>
      </div>
    );
  }

  const iconOptions = [
    { value: 'ChefHat', label: 'Chef Hat', icon: ChefHat },
    { value: 'Wheat', label: 'Wheat', icon: Wheat },
    { value: 'Apple', label: 'Apple', icon: Apple },
    { value: 'Droplets', label: 'Droplets', icon: Droplets },
    { value: 'Package', label: 'Package', icon: Package }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Product Categories</h2>
          <p className="text-gray-600 mt-1">Manage your product categories and organize your inventory</p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="gap-2 text-red-600 border-red-200 hover:bg-red-50"
            onClick={() => setIsConfirmingDeleteAll(true)}
            disabled={categories.length === 0 || categories.every(c => categoryHasProducts(c))}
          >
            <Trash2 className="h-4 w-4" />
            Delete All
          </Button>
          
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            console.log('Dialog state changing:', { open, editing: !!editingCategory });
            
            setIsDialogOpen(open);
            if (!open) {
              resetForm();
            }
          }}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-agro-green-600 hover:bg-agro-green-700">
                <Plus className="h-4 w-4" />
                Add Category
              </Button>
            </DialogTrigger>
            
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingCategory ? 'Edit Category' : 'Add New Category'}
                </DialogTitle>
                <DialogDescription>
                  {editingCategory ? 'Update the category information below.' : 'Create a new product category for your store.'}
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Category Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Organic Spices"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the category"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="icon">Icon</Label>
                  <select
                    id="icon"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value as "ChefHat" | "Wheat" | "Apple" | "Droplets" | "Package" })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    {iconOptions.map(option => (
                      <option key={`icon-${option.value}`} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="image">Image URL (Optional)</Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1 bg-agro-green-600 hover:bg-agro-green-700">
                    {editingCategory ? 'Update Category' : 'Add Category'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={fetchCategories}
            title="Refresh categories list"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            Refresh
          </Button>
        </div>
      </div>

      {/* Search and Stats */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-4 text-sm text-gray-600">
          <span className="bg-gray-100 px-3 py-1 rounded-full">
            Total: {categories.length} categories
          </span>
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
            Active: {categories.filter(c => c.status === 'active').length}
          </span>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          {error}
        </div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => {
          const IconComponent = getIconComponent(category.icon || 'ChefHat');
          const hasProducts = categoryHasProducts(category);
          const productCount = getProductCount(category);
          
          return (
            <Card key={category._id} className="group hover:shadow-lg transition-all duration-200 border-2 hover:border-agro-green-200">
              <div className="relative">
                {/* Improved image handling with fallback and error handling */}
                {category.image ? (
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                    onError={(e) => {
                      // Handle image loading errors by setting a placeholder
                      e.currentTarget.src = 'https://placehold.co/600x400?text=No+Image';
                    }}
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-100 rounded-t-lg flex items-center justify-center text-gray-400">
                    <IconComponent className="h-12 w-12" />
                  </div>
                )}
                
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm p-2 rounded-lg">
                  <IconComponent className="h-5 w-5 text-agro-green-600" />
                </div>
                <div className="absolute top-3 right-3 flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="bg-white/90 backdrop-blur-sm hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleEdit(category)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="bg-white/90 backdrop-blur-sm hover:bg-red-50 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDeleteConfirm(category._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-gray-900">{category.name}</CardTitle>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    {category.status || 'active'}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {category.description || 'No description provided'}
                </p>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Package className="h-4 w-4" />
                    <span className={hasProducts ? "font-medium text-amber-600" : ""}>
                      {productCount} products
                    </span>
                    {hasProducts && (
                      <span className="text-xs text-amber-600">(Cannot delete)</span>
                    )}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-agro-green-600 border-agro-green-200 hover:bg-agro-green-50"
                    onClick={() => navigate(`/admin/products?category=${category._id}`)}
                  >
                    View Products
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {filteredCategories.length === 0 && (
        <Card className="p-12 text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating your first product category.'}
          </p>
          {!searchTerm && (
            <Button 
              onClick={() => setIsDialogOpen(true)} 
              className="gap-2 bg-agro-green-600 hover:bg-agro-green-700"
            >
              <Plus className="h-4 w-4" />
              Add Your First Category
            </Button>
          )}
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!confirmDeleteId} onOpenChange={(open) => !open && setConfirmDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>This will permanently delete the category. This action cannot be undone.</p>
              
              {confirmDeleteId && (() => {
                const foundCategory = categories.find(c => c._id === confirmDeleteId);
                return foundCategory ? categoryHasProducts(foundCategory) : false;
              })() ? (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-md mt-2">
                  <p className="font-medium flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Warning: This category has associated products
                  </p>
                  <p className="mt-1">
                    You cannot delete a category that has products. Please first remove or reassign all products in this category.
                  </p>
                  <Button 
                    className="mt-2 w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => {
                      setConfirmDeleteId(null);
                      navigate(`/admin/products?category=${confirmDeleteId}`);
                    }}
                  >
                    Manage Products in this Category
                  </Button>
                </div>
              ) : (
                <p className="text-amber-600 font-medium">
                  Note: Categories with associated products cannot be deleted. Please remove or reassign 
                  any products in this category first.
                </p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeleting || (confirmDeleteId && categoryHasProducts(categories.find(c => c._id === confirmDeleteId) || {}))}
              className={`bg-red-600 hover:bg-red-700 text-white ${
                confirmDeleteId && categoryHasProducts(categories.find(c => c._id === confirmDeleteId) || {}) 
                  ? 'opacity-50 cursor-not-allowed' 
                  : ''
              }`}
              onClick={() => confirmDeleteId && handleDelete(confirmDeleteId)}
            >
              {isDeleting ? <Spinner size="sm" className="mr-2" /> : null}
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add the "Delete All" confirmation dialog */}
      <AlertDialog open={isConfirmingDeleteAll} onOpenChange={(open) => !open && setIsConfirmingDeleteAll(false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete All Categories?</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>This will permanently delete all categories that don't have associated products. This action cannot be undone.</p>
              
              {categories.some(c => categoryHasProducts(c)) && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-md mt-2">
                  <p className="font-medium flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Warning: Some categories have associated products
                  </p>
                  <p className="mt-1">
                    Categories with products will not be deleted. You need to remove or reassign the products first.
                  </p>
                </div>
              )}
              
              <p className="font-medium mt-4">
                {categories.filter(c => !categoryHasProducts(c)).length} out of {categories.length} categories will be deleted.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingAll}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeletingAll || categories.filter(c => !categoryHasProducts(c)).length === 0}
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleDeleteAll}
            >
              {isDeletingAll ? <Spinner size="sm" className="mr-2" /> : null}
              {isDeletingAll ? "Deleting..." : "Delete All Categories"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Categories;
