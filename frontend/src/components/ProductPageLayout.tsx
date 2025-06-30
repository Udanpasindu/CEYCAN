import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Phone, Mail } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import type { Product } from '@/services/api';

interface ProductPageLayoutProps {
  categoryName: string;
  categoryIcon: React.ComponentType<{ className?: string }>;
  description: string;
  heroImage: string;
  products: Product[];
  isLoading?: boolean;
}

const ProductPageLayout: React.FC<ProductPageLayoutProps> = ({
  categoryName,
  categoryIcon: CategoryIcon,
  description,
  heroImage,
  products,
  isLoading = false
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-agro-green-50 to-agro-brown-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <div className="bg-agro-green-600 text-white p-2 rounded-lg mr-3">
                  <img src="/favicon.ico" alt="Ceycan Agro" className="h-6 w-6" />
                </div>
                <span className="font-bold text-2xl text-agro-green-800">CeyCan Agro</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="outline" className="border-agro-green-600 text-agro-green-600 hover:bg-agro-green-600 hover:text-white gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-4">
                <div className="bg-agro-green-600 text-white p-3 rounded-lg mr-4">
                  <CategoryIcon className="h-8 w-8" />
                </div>
                <Badge className="bg-agro-green-100 text-agro-green-800 border-agro-green-200">
                  Premium Quality
                </Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-agro-green-800 mb-6">
                {categoryName}
              </h1>
              <p className="text-xl text-agro-brown-600 mb-8 leading-relaxed">
                {description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="tel:+94112345678">
                  <Button size="lg" className="agro-gradient hover:agro-gradient-hover text-white px-8 py-4 text-lg rounded-xl w-full sm:w-auto">
                    <Phone className="h-5 w-5 mr-2" />
                    Contact for Orders
                  </Button>
                </a>
                <Button size="lg" variant="outline" className="border-agro-green-600 text-agro-green-600 hover:bg-agro-green-600 hover:text-white px-8 py-4 text-lg rounded-xl">
                  <Mail className="h-5 w-5 mr-2" />
                  Get Quote
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src={heroImage} 
                alt={categoryName}
                className="rounded-xl shadow-2xl w-full h-96 object-cover"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg">
                <div className="text-2xl font-bold text-agro-green-600">{products.length}+</div>
                <div className="text-agro-brown-600">Products Available</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-agro-green-800 mb-4">Our {categoryName} Collection</h2>
            <p className="text-xl text-agro-brown-600 max-w-2xl mx-auto">
              Discover our premium selection of {categoryName.toLowerCase()}, carefully sourced and processed to maintain the highest quality standards.
            </p>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <Spinner size="lg" />
              <span className="ml-3 text-xl">Loading products...</span>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product, index) => (
                <Card key={product._id || index} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-agro-green-100 hover:border-agro-green-300">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {product.inStock !== false && (
                      <div className="absolute top-4 right-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        In Stock
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-agro-green-800 mb-2">{product.name}</h3>
                    <p className="text-agro-brown-600 leading-relaxed mb-4">{product.description}</p>
                    {product.price && (
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-agro-green-600">{product.price}</span>
                        <a href="tel:+94112345678">
                          <Button size="sm" className="bg-agro-green-600 hover:bg-agro-green-700">
                            Contact for Order
                          </Button>
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <img src="/favicon.ico" alt="Ceycan Agro" className="h-16 w-16 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600">
                We're currently updating our collection of {categoryName.toLowerCase()}.<br />
                Please check back soon or contact us for more information.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-agro-green-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Order?</h2>
          <p className="text-xl text-agro-green-100 mb-8">
            Contact us today to place your order or get a custom quote for bulk purchases.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+94112345678">
              <Button size="lg" className="bg-white text-agro-green-800 hover:bg-agro-green-50 px-8 py-4 text-lg rounded-xl w-full sm:w-auto">
                <Phone className="h-5 w-5 mr-2" />
                Call: +94 11 234 5678
              </Button>
            </a>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-agro-green-800 px-8 py-4 text-lg rounded-xl">
              <Mail className="h-5 w-5 mr-2" />
              Email: info@ceycanagro.com
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductPageLayout;
