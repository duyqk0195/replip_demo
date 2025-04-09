import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Product, CustomizationType, ProductFilters } from '@/lib/types';
import ProductCard from './ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductGridProps {
  filters?: ProductFilters;
}

export default function ProductGrid({ filters }: ProductGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  // Construct query string from filters
  const getQueryString = () => {
    if (!filters) return '';
    
    const params = new URLSearchParams();
    
    if (filters.categoryId) {
      params.append('categoryId', filters.categoryId.toString());
    }
    
    if (filters.priceRange) {
      if (filters.priceRange.min !== undefined) {
        params.append('minPrice', filters.priceRange.min.toString());
      }
      if (filters.priceRange.max !== undefined) {
        params.append('maxPrice', filters.priceRange.max.toString());
      }
    }
    
    if (filters.customizationTypes && filters.customizationTypes.length > 0) {
      params.append('customizationTypes', filters.customizationTypes.join(','));
    }
    
    if (filters.search) {
      params.append('search', filters.search);
    }
    
    if (filters.sort) {
      params.append('sort', filters.sort);
    }
    
    if (filters.minRating) {
      params.append('minRating', filters.minRating.toString());
    }
    
    return `?${params.toString()}`;
  };

  // Fetch products
  const { data: products, isLoading: productsLoading, error: productsError } = useQuery<Product[]>({
    queryKey: [`/api/products${getQueryString()}`],
  });

  // Fetch customization types
  const { data: customizationTypes, isLoading: typesLoading } = useQuery<CustomizationType[]>({
    queryKey: ['/api/customization-types'],
  });

  // Calculate pagination
  const isLoading = productsLoading || typesLoading;
  const totalProducts = products?.length || 0;
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  
  const paginatedProducts = products?.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (productsError) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 dark:text-red-400">Failed to load products. Please try again later.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Product Grid */}
      <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
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
        ) : paginatedProducts && paginatedProducts.length > 0 ? (
          // Actual products
          paginatedProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              customizationTypes={customizationTypes || []} 
            />
          ))
        ) : (
          // No products found
          <div className="col-span-full text-center py-10">
            <p className="text-slate-600 dark:text-slate-400">No products found matching your criteria.</p>
          </div>
        )}
      </div>
      
      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <div className="mt-12 flex justify-center">
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <Button
              variant="outline"
              size="sm"
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <span className="sr-only">Previous</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            {/* First page */}
            {currentPage > 2 && (
              <Button
                variant={currentPage === 1 ? "default" : "outline"}
                size="sm"
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                  currentPage === 1
                    ? 'z-10 bg-primary-50 dark:bg-primary-900/20 border-primary-500 dark:border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 bg-white dark:bg-slate-800'
                }`}
                onClick={() => handlePageChange(1)}
              >
                1
              </Button>
            )}
            
            {/* Ellipsis for many pages */}
            {currentPage > 3 && (
              <span className="relative inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-400">
                ...
              </span>
            )}
            
            {/* Previous page if not first */}
            {currentPage > 1 && (
              <Button
                variant="outline"
                size="sm"
                className="relative inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
                onClick={() => handlePageChange(currentPage - 1)}
              >
                {currentPage - 1}
              </Button>
            )}
            
            {/* Current page */}
            <Button
              variant="default"
              size="sm"
              className="z-10 bg-primary-50 dark:bg-primary-900/20 border-primary-500 dark:border-primary-500 text-primary-600 dark:text-primary-400 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
            >
              {currentPage}
            </Button>
            
            {/* Next page if not last */}
            {currentPage < totalPages && (
              <Button
                variant="outline"
                size="sm"
                className="relative inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
                onClick={() => handlePageChange(currentPage + 1)}
              >
                {currentPage + 1}
              </Button>
            )}
            
            {/* Ellipsis for many pages */}
            {currentPage < totalPages - 2 && (
              <span className="relative inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-400">
                ...
              </span>
            )}
            
            {/* Last page if not current or next */}
            {currentPage < totalPages - 1 && (
              <Button
                variant="outline"
                size="sm"
                className="relative inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
                onClick={() => handlePageChange(totalPages)}
              >
                {totalPages}
              </Button>
            )}
            
            <Button
              variant="outline"
              size="sm"
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <span className="sr-only">Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </nav>
        </div>
      )}
    </div>
  );
}
