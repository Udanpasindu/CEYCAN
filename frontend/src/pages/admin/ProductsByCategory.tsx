import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Spinner } from "@/components/ui/spinner";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Package, 
  Search,
  ChefHat,
  ArrowLeft
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getCategory, getProductsByCategory, createProduct, updateProduct, deleteProduct } from '@/services/api';
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const ProductsByCategory = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    price: '',
    inStock: true,
    category: categoryId
  });

  useEffect(() => {
    if (categoryId) {
      fetchCategory();
      fetchProducts();
    }
  }, [categoryId]);

  const fetchCategory = async () => {
    try {
      const data = await getCategory(categoryId);
      setCategory(data);
    } catch (err) {
      console.error('Error fetching category:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load category details. Please try again.",
      });
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProductsByCategory(categoryId);
      setProducts(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again.');
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load products for this category. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingProduct) {
        const updatedProduct = await updateProduct(editingProduct._id, formData);
        setProducts(products.map(prod => 
          prod._id === editingProduct._id ? updatedProduct : prod
        ));
        toast({
          title: "Product Updated",
          description: `${formData.name} has been updated successfully.`,
        });
      } else {
        const newProduct = await createProduct({...formData, category: categoryId});
        setProducts([...products, newProduct]);
        toast({
          title: "Product Added",
          description: `${formData.name} has been added successfully.`,
        });
      }
    } catch (err) {
      console.error('Error saving product:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save product. Please try again.",
      });
    }
    
    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      image: product.image || '',
      price: product.price,
      inStock: product.inStock !== false,
      category: categoryId
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      setProducts(products.filter(prod => prod._id !== id));
      toast({
        title: "Product Deleted",
        description: "Product has been removed successfully.",
      });
    } catch (err) {
      console.error('Error deleting product:', err);
      const errorMessage = err instanceof Error 
        ? err.message 
        : "Failed to delete product. Please try again.";
      
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      image: '',
      price: '',
      inStock: true,
      category: categoryId
    });
    setEditingProduct(null);
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
        <span className="ml-2">Loading products...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Button 
            variant="ghost" 
            className="mb-2 -ml-3 text-gray-500 hover:text-gray-900"
            onClick={() => navigate('/admin/products')}
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to All Products
          </Button>
          <h2 className="text-3xl font-bold text-gray-900">{category?.name || 'Category'} Products</h2>
          <p className="text-gray-600 mt-1">
            {category?.description || `Manage products in this category`}
          </p>
        </div>
        <Button 
          className="gap-2 bg-agro-green-600 hover:bg-agro-green-700"
          onClick={() => setIsDialogOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Search */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Error display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          {error}
        </div>
      )}

      {/* Product dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </DialogTitle>
            <DialogDescription>
              {editingProduct ? 'Update the product information below.' : 'Create a new product to add to this category.'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Ceylon Cinnamon"
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the product"
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="e.g., From $12/kg"
                  required
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="inStock" 
                  checked={formData.inStock} 
                  onCheckedChange={(checked) => setFormData({ ...formData, inStock: checked })}
                />
                <Label htmlFor="inStock">In Stock</Label>
              </div>
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1 bg-agro-green-600 hover:bg-agro-green-700">
                {editingProduct ? 'Update Product' : 'Add Product'}
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

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product._id} className="group hover:shadow-lg transition-all duration-200 border-2 hover:border-agro-green-200 overflow-hidden">
              <div className="relative h-48">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="bg-white/90 backdrop-blur-sm hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleEdit(product)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="bg-white/90 backdrop-blur-sm hover:bg-red-50 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDelete(product._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                {product.inStock ? (
                  <Badge className="absolute top-3 left-3 bg-green-500 text-white">
                    In Stock
                  </Badge>
                ) : (
                  <Badge className="absolute top-3 left-3 bg-gray-500 text-white">
                    Out of Stock
                  </Badge>
                )}
              </div>
              
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{product.name}</CardTitle>
              </CardHeader>
              
              <CardContent className="pb-2">
                <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
              </CardContent>
              
              <CardFooter className="flex justify-end items-center pt-0">
                <span className="font-medium text-agro-green-700">{product.price}</span>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <ChefHat className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm ? 'Try adjusting your search terms.' : 'Start adding products to this category.'}
          </p>
          <Button 
            onClick={() => setIsDialogOpen(true)} 
            className="gap-2 bg-agro-green-600 hover:bg-agro-green-700"
          >
            <Plus className="h-4 w-4" />
            Add Your First Product
          </Button>
        </Card>
      )}
    </div>
  );
};

export default ProductsByCategory;
