import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'wouter';
import { Product } from '@/lib/types';
import ProductDetail from '@/components/products/ProductDetail';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const productId = parseInt(id);
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Fetch product details
  const { 
    data: product, 
    isLoading, 
    error 
  } = useQuery<Product>({
    queryKey: [`/api/products/${productId}`],
    enabled: !isNaN(productId),
  });
  
  if (isNaN(productId)) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-xl font-semibold text-red-500 dark:text-red-400">Invalid Product ID</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          The product ID provided is not valid.
        </p>
      </div>
    );
  }
  
  return (
    <section className="py-12 bg-white dark:bg-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          // Loading skeleton
          <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
            <div className="flex flex-col space-y-4">
              <Skeleton className="w-full h-[400px] rounded-lg" />
              <div className="grid grid-cols-4 gap-4">
                <Skeleton className="w-full h-24 rounded-lg" />
                <Skeleton className="w-full h-24 rounded-lg" />
                <Skeleton className="w-full h-24 rounded-lg" />
                <Skeleton className="w-full h-24 rounded-lg" />
              </div>
            </div>
            <div className="mt-10 lg:mt-0">
              <Skeleton className="h-10 w-3/4 mb-2" />
              <Skeleton className="h-6 w-1/4 mb-6" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3 mb-6" />
              <Skeleton className="h-6 w-1/3 mb-3" />
              <div className="space-y-2 mb-6">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <Skeleton className="h-12 w-full mb-4" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        ) : error ? (
          // Error state
          <div className="text-center py-10">
            <h2 className="text-xl font-semibold text-red-500 dark:text-red-400">Failed to load product</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              We couldn't load this product's information. Please try again later.
            </p>
          </div>
        ) : product ? (
          // Product found
          <ProductDetail product={product} />
        ) : (
          // Product not found
          <div className="text-center py-10">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Product Not Found</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              The product you're looking for doesn't exist or has been removed.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
