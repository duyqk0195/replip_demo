import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Filter, X } from 'lucide-react';
import { PriceRange, ProductFilters as ProductFiltersType, CustomizationType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from '@/components/ui/sheet';

interface ProductFiltersProps {
  filters: ProductFiltersType;
  onChange: (filters: ProductFiltersType) => void;
}

export default function ProductFilters({ filters, onChange }: ProductFiltersProps) {
  // State for filter values in mobile drawer
  const [tempFilters, setTempFilters] = useState<ProductFiltersType>(filters);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Fetch customization types
  const { data: customizationTypes } = useQuery<CustomizationType[]>({
    queryKey: ['/api/customization-types'],
  });

  // Update local state when parent filters change
  useEffect(() => {
    setTempFilters(filters);
  }, [filters]);

  // Handle price range change
  const handlePriceChange = (value: string) => {
    let priceRange: PriceRange = {};
    
    switch (value) {
      case 'under-100':
        priceRange = { max: 100 };
        break;
      case '100-200':
        priceRange = { min: 100, max: 200 };
        break;
      case 'over-200':
        priceRange = { min: 200 };
        break;
      case 'any':
      default:
        priceRange = {};
        break;
    }
    
    setTempFilters({ ...tempFilters, priceRange });
  };

  // Handle customization filter change
  const handleCustomizationChange = (typeId: number, checked: boolean) => {
    let types = [...(tempFilters.customizationTypes || [])];
    
    if (checked) {
      types.push(typeId);
    } else {
      types = types.filter(id => id !== typeId);
    }
    
    setTempFilters({ ...tempFilters, customizationTypes: types });
  };

  // Handle rating filter change
  const handleRatingChange = (value: string) => {
    let rating: number | undefined;
    
    switch (value) {
      case '4plus':
        rating = 4;
        break;
      case '4.5plus':
        rating = 4.5;
        break;
      case 'any':
      default:
        rating = undefined;
        break;
    }
    
    setTempFilters({ ...tempFilters, minRating: rating });
  };

  // Apply filters from mobile drawer
  const applyFilters = () => {
    onChange(tempFilters);
    setMobileOpen(false);
  };

  // Clear all filters
  const clearAllFilters = () => {
    const clearedFilters: ProductFiltersType = {
      categoryId: tempFilters.categoryId, // Keep category
      search: tempFilters.search // Keep search term
    };
    setTempFilters(clearedFilters);
    onChange(clearedFilters);
  };

  // Get current price range value for radio buttons
  const getCurrentPriceValue = (): string => {
    const { priceRange } = tempFilters;
    if (!priceRange) return 'any';
    if (priceRange.max === 100) return 'under-100';
    if (priceRange.min === 100 && priceRange.max === 200) return '100-200';
    if (priceRange.min === 200) return 'over-200';
    return 'any';
  };

  // Get current rating value for radio buttons
  const getCurrentRatingValue = (): string => {
    const { minRating } = tempFilters;
    if (!minRating) return 'any';
    if (minRating === 4) return '4plus';
    if (minRating === 4.5) return '4.5plus';
    return 'any';
  };

  // Desktop filters
  const FiltersContent = () => (
    <>
      <div className="mb-6">
        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">Price Range</h3>
        <RadioGroup 
          value={getCurrentPriceValue()} 
          onValueChange={handlePriceChange}
          className="space-y-2"
        >
          <div className="flex items-center">
            <RadioGroupItem id="price-any" value="any" />
            <Label htmlFor="price-any" className="ml-3 text-sm text-slate-700 dark:text-slate-300">Any price</Label>
          </div>
          <div className="flex items-center">
            <RadioGroupItem id="price-under-100" value="under-100" />
            <Label htmlFor="price-under-100" className="ml-3 text-sm text-slate-700 dark:text-slate-300">Under $100</Label>
          </div>
          <div className="flex items-center">
            <RadioGroupItem id="price-100-200" value="100-200" />
            <Label htmlFor="price-100-200" className="ml-3 text-sm text-slate-700 dark:text-slate-300">$100 to $200</Label>
          </div>
          <div className="flex items-center">
            <RadioGroupItem id="price-over-200" value="over-200" />
            <Label htmlFor="price-over-200" className="ml-3 text-sm text-slate-700 dark:text-slate-300">$200 & above</Label>
          </div>
        </RadioGroup>
      </div>
      
      <Separator className="my-6" />
      
      <div className="mb-6">
        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">Customization</h3>
        <div className="space-y-2">
          {customizationTypes?.map(type => (
            <div key={type.id} className="flex items-center">
              <Checkbox 
                id={`custom-${type.id}`}
                checked={tempFilters.customizationTypes?.includes(type.id)}
                onCheckedChange={(checked) => 
                  handleCustomizationChange(type.id, checked as boolean)
                }
              />
              <Label 
                htmlFor={`custom-${type.id}`} 
                className="ml-3 text-sm text-slate-700 dark:text-slate-300"
              >
                {type.displayName}
              </Label>
            </div>
          ))}
          {!customizationTypes?.length && (
            <p className="text-sm text-slate-500 dark:text-slate-400">Loading customization options...</p>
          )}
        </div>
      </div>
      
      <Separator className="my-6" />
      
      <div className="mb-6">
        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">Rating</h3>
        <RadioGroup 
          value={getCurrentRatingValue()} 
          onValueChange={handleRatingChange}
          className="space-y-2"
        >
          <div className="flex items-center">
            <RadioGroupItem id="rating-any" value="any" />
            <Label htmlFor="rating-any" className="ml-3 text-sm text-slate-700 dark:text-slate-300">Any rating</Label>
          </div>
          <div className="flex items-center">
            <RadioGroupItem id="rating-4plus" value="4plus" />
            <Label htmlFor="rating-4plus" className="ml-3 text-sm flex items-center text-slate-700 dark:text-slate-300">
              4+ <Star className="ml-1 h-3.5 w-3.5 text-amber-400 fill-amber-400" />
            </Label>
          </div>
          <div className="flex items-center">
            <RadioGroupItem id="rating-4.5plus" value="4.5plus" />
            <Label htmlFor="rating-4.5plus" className="ml-3 text-sm flex items-center text-slate-700 dark:text-slate-300">
              4.5+ <Star className="ml-1 h-3.5 w-3.5 text-amber-400 fill-amber-400" />
            </Label>
          </div>
        </RadioGroup>
      </div>
    </>
  );

  // Mobile filter button and drawer
  const MobileFilters = () => (
    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center gap-2 lg:hidden"
          onClick={() => setMobileOpen(true)}
        >
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>Filter Products</SheetTitle>
          <SheetDescription>
            Narrow down products with these filter options
          </SheetDescription>
        </SheetHeader>
        <div className="py-4 overflow-y-auto">
          <FiltersContent />
        </div>
        <SheetFooter>
          <div className="flex w-full gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={clearAllFilters}
            >
              Clear All
            </Button>
            <SheetClose asChild>
              <Button 
                className="flex-1" 
                onClick={applyFilters}
              >
                Apply Filters
              </Button>
            </SheetClose>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );

  return (
    <>
      {/* Mobile Filters */}
      <div className="lg:hidden mb-6">
        <MobileFilters />
      </div>
      
      {/* Desktop Filters */}
      <Card className="hidden lg:block sticky top-20 h-fit">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Filters</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 text-slate-500 dark:text-slate-400"
              onClick={clearAllFilters}
            >
              <X className="mr-2 h-4 w-4" />
              Clear all
            </Button>
          </div>
          <Separator className="mb-6" />
          <FiltersContent />
          <Button 
            className="w-full mt-6" 
            onClick={() => onChange(tempFilters)}
          >
            Apply Filters
          </Button>
        </CardContent>
      </Card>
    </>
  );
}

// Star icon component for rating filter
function Star(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
