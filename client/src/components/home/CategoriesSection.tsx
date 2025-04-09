import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { ArrowRight } from 'lucide-react';
import { Category } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function CategoriesSection() {
  const { data: categories, isLoading, error } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  if (error) {
    return (
      <section id="categories" className="py-12 bg-white dark:bg-slate-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-red-500 dark:text-red-400">Failed to load categories</p>
        </div>
      </section>
    );
  }

  return (
    <section id="categories" className="py-12 bg-white dark:bg-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Browse by Category
        </h2>
        <p className="mt-4 max-w-2xl text-xl text-slate-600 dark:text-slate-300">
          Explore our extensive range of handcrafted products organized by category.
        </p>
        
        <div className="mt-10 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {isLoading ? (
            // Loading skeleton
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="group relative">
                <Skeleton className="w-full h-60 rounded-lg" />
                <div className="mt-4 flex justify-between">
                  <div>
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="mt-1 h-4 w-32" />
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            ))
          ) : (
            // Loaded categories
            categories?.map((category) => (
              <div key={category.id} className="group relative">
                <div className="w-full h-60 bg-slate-200 dark:bg-slate-700 rounded-lg overflow-hidden group-hover:opacity-90 transition-opacity">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-center object-cover" 
                  />
                </div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white">
                      <Link href={`/products?category=${category.id}`} className="focus:outline-none">
                        <span aria-hidden="true" className="absolute inset-0"></span>
                        {category.name}
                      </Link>
                    </h3>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                      {category.description}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-primary-600 dark:text-primary-400">{category.productCount} products</p>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="mt-8 text-center">
          <Link href="/categories" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 dark:text-primary-300 bg-primary-100 dark:bg-primary-900/20 hover:bg-primary-200 dark:hover:bg-primary-900/30 transition duration-150 ease-in-out">
            View All Categories
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
