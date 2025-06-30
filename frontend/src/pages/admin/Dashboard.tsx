import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Package, 
  TrendingUp, 
  Users, 
  DollarSign,
  Plus,
  Eye,
  Edit,
  ChefHat
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getCategories } from '@/services/api';
import { categoryToRoute, getCategoryIdByName } from '@/utils/categoryRoutes';

const Dashboard = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryName: string) => {
    const categoryId = getCategoryIdByName(categories, categoryName);
    if (categoryId) {
      navigate(`/admin/products/category/${categoryId}`);
    } else {
      navigate(categoryToRoute(categoryName));
    }
  };

  const stats = [
    {
      title: "Total Categories",
      value: "9",
      change: "+2 this month",
      changeType: "positive",
      icon: Package
    },
    {
      title: "Total Products",
      value: "147",
      change: "+12 this week",
      changeType: "positive",
      icon: ChefHat
    },
    {
      title: "Page Views",
      value: "2,847",
      change: "+15% from last month",
      changeType: "positive",
      icon: Eye
    },
    {
      title: "Inquiries",
      value: "23",
      change: "+5 this week",
      changeType: "positive",
      icon: Users
    }
  ];

  const recentCategories = [
    { name: "Spices", products: 25, status: "active" },
    { name: "Rice & Grains", products: 18, status: "active" },
    { name: "Pickles & Snacks", products: 12, status: "active" },
    { name: "Oil & Ghee", products: 15, status: "active" },
    { name: "Seafood", products: 8, status: "active" }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-agro-green-600 to-agro-green-700 rounded-xl p-6 text-white">
        <h2 className="text-3xl font-bold mb-2">Welcome back, Admin!</h2>
        <p className="text-agro-green-100 mb-4">
          Here's what's happening with your CeyCan Agro platform today.
        </p>
        <div className="flex gap-4">
          <Link to="/admin/categories">
            <Button variant="secondary" className="gap-2">
              <Package className="h-4 w-4" />
              Manage Categories
            </Button>
          </Link>
          <Link to="/admin/products">
            <Button variant="outline" className="gap-2 border-white text-white hover:bg-white/10">
              <ChefHat className="h-4 w-4" />
              Manage Products
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <IconComponent className="h-4 w-4 text-agro-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <p className="text-xs text-gray-500 mt-1">
                  <span className={stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}>
                    {stat.change}
                  </span>
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Categories */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">Product Categories</CardTitle>
            <Link to="/admin/categories">
              <Button variant="outline" size="sm" className="gap-2">
                <Edit className="h-4 w-4" />
                Manage
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-4">Loading categories...</div>
              ) : categories.length > 0 ? (
                categories.map((category) => (
                  <div 
                    key={category._id} 
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div 
                      className="flex items-center space-x-3 cursor-pointer hover:text-agro-green-700"
                      onClick={() => handleCategoryClick(category.name)}
                    >
                      <div className="bg-agro-green-100 p-2 rounded-lg">
                        <Package className="h-4 w-4 text-agro-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{category.name}</h4>
                        <p className="text-sm text-gray-500">{category.products} products</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="secondary" 
                        className="bg-green-100 text-green-700 hover:bg-green-200"
                      >
                        {category.status || 'active'}
                      </Badge>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-1 text-agro-green-700 border-agro-green-300 hover:bg-agro-green-50"
                        onClick={() => navigate(`/admin/products/category/${category._id}`)}
                      >
                        <Plus className="h-3 w-3" />
                        Add Products
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">No categories found</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              <Link to="/admin/categories">
                <Button variant="outline" className="w-full justify-start gap-3 h-12">
                  <Package className="h-5 w-5 text-agro-green-600" />
                  <div className="text-left">
                    <div className="font-medium">Manage Categories</div>
                    <div className="text-sm text-gray-500">Add, edit, or remove product categories</div>
                  </div>
                </Button>
              </Link>
              
              <Link to="/admin/products">
                <Button variant="outline" className="w-full justify-start gap-3 h-12">
                  <ChefHat className="h-5 w-5 text-agro-green-600" />
                  <div className="text-left">
                    <div className="font-medium">Manage Products</div>
                    <div className="text-sm text-gray-500">Add products to categories</div>
                  </div>
                </Button>
              </Link>
              
              <Link to="/admin/settings">
                <Button variant="outline" className="w-full justify-start gap-3 h-12">
                  <Users className="h-5 w-5 text-agro-green-600" />
                  <div className="text-left">
                    <div className="font-medium">Contact Settings</div>
                    <div className="text-sm text-gray-500">Update contact information</div>
                  </div>
                </Button>
              </Link>
              
              <Link to="/">
                <Button variant="outline" className="w-full justify-start gap-3 h-12">
                  <Eye className="h-5 w-5 text-agro-green-600" />
                  <div className="text-left">
                    <div className="font-medium">Preview Website</div>
                    <div className="text-sm text-gray-500">See how your site looks to visitors</div>
                  </div>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Plus className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">New category "Specialty Products" added</p>
                <p className="text-sm text-gray-500">2 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <div className="bg-green-100 p-2 rounded-lg">
                <Edit className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Contact information updated</p>
                <p className="text-sm text-gray-500">1 day ago</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
              <div className="bg-orange-100 p-2 rounded-lg">
                <ChefHat className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">12 new products added to Spices category</p>
                <p className="text-sm text-gray-500">2 days ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
