import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Category, ProductFilters as ProductFiltersType } from '@/lib/types';
import ProductGrid from '@/components/products/ProductGrid';
import ProductFilters from '@/components/products/ProductFilters';
import ProductSort from '@/components/products/ProductSort';
import { Separator } from '@/components/ui/separator';

export default function ProductsPage() {
  const [location] = useLocation();
  const [filters, setFilters] = useState<ProductFiltersType>({});
  const [pageTitle, setPageTitle] = useState('All Products');
  
  // Parse URL search params to set initial filters
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    
    const newFilters: ProductFiltersType = {};
    
    // Handle category filter
    const categoryId = searchParams.get('category');
    if (categoryId && !isNaN(parseInt(categoryId))) {
      newFilters.categoryId = parseInt(categoryId);
    }
    
    // Handle search filter
    const search = searchParams.get('search');
    if (search) {
      newFilters.search = search;
    }
    
    // Handle customization filter
    const customizationType = searchParams.get('customization');
    if (customizationType && !isNaN(parseInt(customizationType))) {
      newFilters.customizationTypes = [parseInt(customizationType)];
    }
    
    // Handle sort parameter
    const sort = searchParams.get('sort');
    if (sort && ['popular', 'newest', 'price-asc', 'price-desc', 'rating'].includes(sort)) {
      newFilters.sort = sort as any;
    }
    
    setFilters(newFilters);
  }, [location]);
  
  // Fetch categories to show category name in title if filtering by category
  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });
  
  // Update page title when category filter changes
  useEffect(() => {
    if (filters.categoryId && categories) {
      const category = categories.find(c => c.id === filters.categoryId);
      if (category) {
        setPageTitle(`${category.name}`);
        return;
      }
    }
    
    if (filters.search) {
      setPageTitle(`Search Results: "${filters.search}"`);
      return;
    }
    
    setPageTitle('All Products');
  }, [filters.categoryId, filters.search, categories]);
  
  // Handle filter changes
  const handleFilterChange = (newFilters: ProductFiltersType) => {
    setFilters(newFilters);
    
    // Update URL to reflect filters (for bookmarking/sharing)
    const searchParams = new URLSearchParams();
    
    if (newFilters.categoryId) {
      searchParams.set('category', newFilters.categoryId.toString());
    }
    
    if (newFilters.search) {
      searchParams.set('search', newFilters.search);
    }
    
    if (newFilters.customizationTypes && newFilters.customizationTypes.length > 0) {
      searchParams.set('customization', newFilters.customizationTypes[0].toString());
    }
    
    if (newFilters.sort) {
      searchParams.set('sort', newFilters.sort);
    }
    
    const newUrl = `/products${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    window.history.pushState({}, '', newUrl);
  };
  
  // Handle sort changes
  const handleSortChange = (sort: string) => {
    handleFilterChange({ ...filters, sort: sort as any });
  };
  
  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            {pageTitle}
          </h1>
          {filters.search && (
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Showing results for "{filters.search}"
            </p>
          )}
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full lg:w-1/4">
            <ProductFilters 
              filters={filters} 
              onChange={handleFilterChange} 
            />
          </div>
          
          {/* Products */}
          <div className="flex-1">
            {/* Sort Controls */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {/* Product count would come from API */}
                {/* Currently we don't have pagination on the API */}
              </p>
              <ProductSort 
                currentSort={filters.sort} 
                onSort={handleSortChange} 
              />
            </div>
            
            <Separator className="my-4" />
            
            {/* Product Grid */}
            <ProductGrid filters={filters} />
          </div>
        </div>
      </div>
    </div>
  );
}
