import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import CategoriesSection from '@/components/home/CategoriesSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import CTASection from '@/components/home/CTASection';
import NewsletterSection from '@/components/home/NewsletterSection';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { ArrowRight } from 'lucide-react';
import { Product, CustomizationType } from '@/lib/types';
import ProductCard from '@/components/products/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';

export default function HomePage() {
  // Fetch featured products
  const { data: products, isLoading: productsLoading, error: productsError } = useQuery<Product[]>({
    queryKey: ['/api/featured-products?limit=8'],
  });

  // Fetch customization types
  const { data: customizationTypes, isLoading: typesLoading } = useQuery<CustomizationType[]>({
    queryKey: ['/api/customization-types'],
  });

  const isLoading = productsLoading || typesLoading;

  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <CategoriesSection />
      
      {/* Featured Products Section */}
      <section id="products" className="py-12 bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Featured Products
              </h2>
              <p className="mt-4 max-w-2xl text-xl text-slate-600 dark:text-slate-300">
                Our most popular handcrafted items with customization options.
              </p>
            </div>
          </div>
          
          {/* Product Grid */}
          <div className="mt-8 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {isLoading ? (
              // Loading skeletons
              Array(8).fill(0).map((_, index) => (
                <div key={index} className="group relative bg-white dark:bg-slate-800 rounded-lg shadow-sm overflow-hidden">
                  <Skeleton className="w-full h-60" />
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <Skeleton className="h-6 w-36 mb-2" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <Skeleton className="h-6 w-10" />
                    </div>
                    <div className="mt-2 flex justify-between items-center">
                      <Skeleton className="h-6 w-16" />
                      <div className="flex space-x-2">
                        <Skeleton className="h-5 w-20" />
                        <Skeleton className="h-5 w-20" />
                      </div>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <Skeleton className="h-10 flex-1" />
                      <Skeleton className="h-10 w-10" />
                    </div>
                  </div>
                </div>
              ))
            ) : productsError ? (
              <div className="col-span-full text-center py-10">
                <p className="text-red-500 dark:text-red-400">Failed to load products. Please try again later.</p>
              </div>
            ) : products && products.length > 0 ? (
              // Render actual products
              products.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  customizationTypes={customizationTypes || []} 
                />
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-slate-600 dark:text-slate-400">No featured products available.</p>
              </div>
            )}
          </div>
          
          <div className="mt-8 text-center">
            <Link href="/products" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition duration-150 ease-in-out">
              View All Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
      
      <TestimonialsSection />
      <CTASection />
      <NewsletterSection />
    </div>
  );
}
