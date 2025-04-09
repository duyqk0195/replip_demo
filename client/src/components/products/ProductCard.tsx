import { useState } from 'react';
import { Link } from 'wouter';
import { Heart, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/contexts/CartContext';
import { Product, CustomizationType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: Product;
  customizationTypes: CustomizationType[];
}

export default function ProductCard({ product, customizationTypes }: ProductCardProps) {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addToCart } = useCart();
  const { toast } = useToast();

  // Find customization types for this product
  const productCustomizations = customizationTypes.filter(type => 
    product.customizationOptions.includes(type.id)
  );

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAddingToCart(true);
    try {
      // Add with default customization
      await addToCart(product.id, 1, {});
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add product to cart',
        variant: 'destructive',
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleCustomize = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Navigate to product detail page for customization
    window.location.href = `/product/${product.id}`;
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    toast({
      title: 'Added to Wishlist',
      description: `${product.name} has been added to your wishlist`,
    });
  };

  return (
    <div className="group relative card-transition bg-white dark:bg-slate-800 rounded-lg shadow-sm hover:shadow-md overflow-hidden">
      <div className="w-full aspect-w-1 aspect-h-1 bg-slate-200 dark:bg-slate-700 overflow-hidden xl:aspect-w-7 xl:aspect-h-8">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-60 object-center object-cover group-hover:opacity-90 transition-opacity" 
        />
        {(product.isBestseller || product.isNew) && (
          <div className="absolute top-0 right-0 m-2">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              product.isBestseller 
                ? 'bg-orange-500 text-white' 
                : 'bg-green-500 text-white'
            }`}>
              {product.isBestseller ? 'Bestseller' : 'New'}
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white">
              <Link href={`/product/${product.id}`}>
                <span aria-hidden="true" className="absolute inset-0"></span>
                {product.name}
              </Link>
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {product.shortDescription}
            </p>
          </div>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
            <span className="ml-1 text-sm text-slate-700 dark:text-slate-300">{product.rating.toFixed(1)}</span>
          </div>
        </div>
        <div className="mt-2 flex justify-between items-center">
          <p className="text-lg font-medium text-slate-900 dark:text-white">
            ${product.price.toFixed(2)}
          </p>
          <div className="flex space-x-2">
            {productCustomizations.slice(0, 2).map(type => (
              <Badge 
                key={type.id} 
                variant="outline" 
                style={{ 
                  backgroundColor: `${type.colorHex}20`,  
                  color: type.colorHex,
                  borderColor: type.colorHex
                }}
              >
                {type.displayName}
              </Badge>
            ))}
          </div>
        </div>
        <div className="mt-4 flex space-x-2">
          <Button 
            className="flex-1 bg-primary-600 hover:bg-primary-700 text-white" 
            onClick={handleCustomize}
          >
            Customize
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="flex-none w-10 h-10 inline-flex items-center justify-center border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700"
            onClick={handleWishlist}
          >
            <Heart className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
