import { useState } from 'react';
import { ArrowDownWideNarrow } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ProductSortProps {
  currentSort?: string;
  onSort: (sort: string) => void;
}

type SortOption = {
  value: string;
  label: string;
};

export default function ProductSort({ currentSort, onSort }: ProductSortProps) {
  const [open, setOpen] = useState(false);
  
  const sortOptions: SortOption[] = [
    { value: 'popular', label: 'Most Popular' },
    { value: 'newest', label: 'Newest' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Customer Rating' },
  ];
  
  const getCurrentSortLabel = (): string => {
    const option = sortOptions.find(option => option.value === currentSort);
    return option ? option.label : 'Sort';
  };
  
  const handleSelect = (value: string) => {
    onSort(value);
    setOpen(false);
  };
  
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
        >
          <ArrowDownWideNarrow className="h-4 w-4" />
          {getCurrentSortLabel()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        {sortOptions.map(option => (
          <DropdownMenuItem 
            key={option.value}
            className={currentSort === option.value ? 'bg-slate-100 dark:bg-slate-700 font-medium' : ''}
            onClick={() => handleSelect(option.value)}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
