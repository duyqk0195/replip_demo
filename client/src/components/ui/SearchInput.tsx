import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function SearchInput() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [_, navigate] = useLocation();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
  };
  
  // Reset isSearching when navigation completes
  useEffect(() => {
    setIsSearching(false);
  }, [_]);
  
  return (
    <form onSubmit={handleSearch}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-slate-400" />
        </div>
        <Input 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          type="text" 
          className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md leading-5 bg-white dark:bg-slate-700 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400 sm:text-sm transition-colors duration-200" 
          placeholder="Search products..." 
          aria-label="Search products"
          disabled={isSearching}
        />
      </div>
    </form>
  );
}
