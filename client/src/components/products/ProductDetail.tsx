import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Star, Truck, RefreshCw, BadgeCheck, MinusIcon, PlusIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/contexts/CartContext';
import { Product, CustomizationType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [customizations, setCustomizations] = useState<Record<string, any>>({});
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { toast } = useToast();
  const { addToCart } = useCart();
  
  // Fetch customization types
  const { data: customizationTypesData, isLoading: typesLoading } = useQuery<CustomizationType[]>({
    queryKey: ['/api/customization-types'],
  });
  
  // Filter product's customization types
  const productCustomizationTypes = customizationTypesData?.filter(type => 
    product.customizationOptions.includes(type.id)
  ) || [];

  // Group customization types by name
  const customizationGroups = productCustomizationTypes.reduce<Record<string, CustomizationType>>((acc, type) => {
    acc[type.name] = type;
    return acc;
  }, {});

  // Handle customization changes
  const handleCustomizationChange = (name: string, value: any) => {
    setCustomizations(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle quantity change
  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(Math.max(1, newQuantity));
  };

  // Add to cart
  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      await addToCart(product.id, quantity, customizations);
      toast({
        title: 'Added to cart',
        description: `${product.name} has been added to your cart`,
        variant: 'default',
      });
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

  // Handle wishlist
  const handleWishlist = () => {
    toast({
      title: 'Added to Wishlist',
      description: `${product.name} has been added to your wishlist`,
    });
  };
  
  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
      {/* Product Images */}
      <div className="flex flex-col space-y-4">
        <div className="bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden">
          <img 
            src={product.images[selectedImage] || product.image} 
            alt={product.name}
            className="w-full h-auto object-center object-cover" 
          />
        </div>
        <div className="grid grid-cols-4 gap-4">
          {product.images.map((img, index) => (
            <button 
              key={index}
              className={`bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden ${
                selectedImage === index ? 'border-2 border-primary-500' : ''
              }`}
              onClick={() => setSelectedImage(index)}
            >
              <img 
                src={img} 
                alt={`${product.name} thumbnail ${index + 1}`}
                className="w-full h-24 object-center object-cover" 
              />
            </button>
          ))}
        </div>
      </div>
      
      {/* Product Info */}
      <div className="mt-10 lg:mt-0">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {product.name}
          </h2>
          <div className="flex items-center bg-amber-50 dark:bg-amber-900/20 px-3 py-1 rounded-full">
            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
            <span className="ml-1 text-sm font-medium text-amber-800 dark:text-amber-400">{product.rating.toFixed(1)}</span>
            {/* Mock number of reviews */}
            <span className="mx-1 text-slate-400">|</span>
            <span className="text-sm text-slate-600 dark:text-slate-400">128 reviews</span>
          </div>
        </div>
        
        <div className="mt-3">
          <h2 className="sr-only">Product information</h2>
          <p className="text-3xl text-slate-900 dark:text-white">${product.price.toFixed(2)}</p>
        </div>
        
        <div className="mt-6">
          <h3 className="text-lg font-medium text-slate-900 dark:text-white">Description</h3>
          <div className="mt-2 space-y-3 text-base text-slate-600 dark:text-slate-300">
            <p>{product.description}</p>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="text-lg font-medium text-slate-900 dark:text-white">Features</h3>
          <div className="mt-2">
            <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300">
              {product.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="text-lg font-medium text-slate-900 dark:text-white">Customization Options</h3>
          
          {/* Leather Color Customization - Only show if has color options */}
          {customizationGroups.color_options && (
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Color</span>
                <span className="text-sm text-primary-600 dark:text-primary-400">Select one</span>
              </div>
              <div className="mt-2 grid grid-cols-4 gap-3">
                {['brown', 'black', 'tan', 'burgundy'].map(color => {
                  const colorMapping: Record<string, string> = {
                    brown: 'bg-amber-800',
                    black: 'bg-slate-900',
                    tan: 'bg-yellow-700',
                    burgundy: 'bg-red-900',
                  };
                  
                  return (
                    <label key={color} className="relative rounded-full cursor-pointer focus:outline-none">
                      <input 
                        type="radio" 
                        name="color" 
                        value={color} 
                        className="sr-only"
                        checked={customizations.color === color}
                        onChange={() => handleCustomizationChange('color', color)}
                      />
                      <span 
                        className={`h-10 w-10 ${colorMapping[color]} border-2 ${
                          customizations.color === color 
                            ? 'border-white dark:border-primary-500' 
                            : 'border-white dark:border-slate-700'
                        } rounded-full flex items-center justify-center`} 
                        aria-label={color.charAt(0).toUpperCase() + color.slice(1)}
                      >
                        {customizations.color === color && (
                          <span className="h-8 w-8 rounded-full border-2 border-white" />
                        )}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Paper Type or Material Type - For products with material options */}
          {(customizationGroups.material_options || product.categoryId === 1) && (
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {product.categoryId === 1 ? 'Paper Type' : 'Material'}
                </span>
                <span className="text-sm text-primary-600 dark:text-primary-400">Select one</span>
              </div>
              <RadioGroup 
                value={customizations.material || ''} 
                onValueChange={(value) => handleCustomizationChange('material', value)}
                className="mt-2 grid grid-cols-3 gap-3"
              >
                {product.categoryId === 1 ? (
                  // Paper types for journals/notebooks
                  <>
                    <Label
                      htmlFor="paper-lined"
                      className={`flex p-3 border ${
                        customizations.material === 'lined'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-slate-300 dark:border-slate-600'
                      } rounded-md items-center justify-center text-sm font-medium uppercase cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700`}
                    >
                      <RadioGroupItem id="paper-lined" value="lined" className="sr-only" />
                      Lined
                    </Label>
                    <Label
                      htmlFor="paper-blank"
                      className={`flex p-3 border ${
                        customizations.material === 'blank'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-slate-300 dark:border-slate-600'
                      } rounded-md items-center justify-center text-sm font-medium uppercase cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700`}
                    >
                      <RadioGroupItem id="paper-blank" value="blank" className="sr-only" />
                      Blank
                    </Label>
                    <Label
                      htmlFor="paper-dotted"
                      className={`flex p-3 border ${
                        customizations.material === 'dotted'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-slate-300 dark:border-slate-600'
                      } rounded-md items-center justify-center text-sm font-medium uppercase cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700`}
                    >
                      <RadioGroupItem id="paper-dotted" value="dotted" className="sr-only" />
                      Dotted
                    </Label>
                  </>
                ) : (
                  // Material options for other product types
                  <>
                    <Label
                      htmlFor="material-option1"
                      className={`flex p-3 border ${
                        customizations.material === 'option1'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-slate-300 dark:border-slate-600'
                      } rounded-md items-center justify-center text-sm font-medium uppercase cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700`}
                    >
                      <RadioGroupItem id="material-option1" value="option1" className="sr-only" />
                      Option 1
                    </Label>
                    <Label
                      htmlFor="material-option2"
                      className={`flex p-3 border ${
                        customizations.material === 'option2'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-slate-300 dark:border-slate-600'
                      } rounded-md items-center justify-center text-sm font-medium uppercase cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700`}
                    >
                      <RadioGroupItem id="material-option2" value="option2" className="sr-only" />
                      Option 2
                    </Label>
                    <Label
                      htmlFor="material-option3"
                      className={`flex p-3 border ${
                        customizations.material === 'option3'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-slate-300 dark:border-slate-600'
                      } rounded-md items-center justify-center text-sm font-medium uppercase cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700`}
                    >
                      <RadioGroupItem id="material-option3" value="option3" className="sr-only" />
                      Option 3
                    </Label>
                  </>
                )}
              </RadioGroup>
            </div>
          )}
          
          {/* Personalization - For products with engraving or monogram */}
          {(customizationGroups.engraving || customizationGroups.monogram) && (
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Personalization</span>
                <span className="text-sm text-primary-600 dark:text-primary-400">Optional</span>
              </div>
              <div className="mt-2">
                <Input 
                  type="text" 
                  placeholder={customizationGroups.engraving 
                    ? "Enter text for engraving" 
                    : "Enter monogram (up to 3 characters)"
                  }
                  value={customizations.personalization || ''}
                  onChange={(e) => handleCustomizationChange('personalization', e.target.value)}
                  maxLength={customizationGroups.monogram ? 3 : 20}
                  className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {customizationGroups.engraving 
                    ? "Up to 20 characters will be embossed on the cover."
                    : "Up to 3 characters for your monogram."
                  }
                </p>
              </div>
            </div>
          )}
          
          {/* Quantity */}
          <div className="mt-6 flex items-center">
            <span className="mr-3 text-sm font-medium text-slate-700 dark:text-slate-300">Quantity</span>
            <div className="flex items-center">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-l-md"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
              >
                <MinusIcon className="h-4 w-4" />
              </Button>
              <Input 
                type="text" 
                value={quantity} 
                readOnly
                className="w-12 h-8 text-center border-t border-b border-slate-300 dark:border-slate-600 rounded-none text-slate-900 dark:text-white bg-white dark:bg-slate-800"
              />
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-r-md"
                onClick={() => handleQuantityChange(quantity + 1)}
              >
                <PlusIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Add to Cart */}
          <div className="mt-8 flex sm:flex-col1">
            <Button 
              className="w-full bg-primary-600 hover:bg-primary-700 text-white flex items-center justify-center py-3"
              onClick={handleAddToCart}
              disabled={isAddingToCart}
            >
              {isAddingToCart ? 'Adding...' : 'Add to Cart'}
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              className="ml-4 py-3 px-3 rounded-md flex items-center justify-center text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-500 dark:hover:text-slate-400"
              onClick={handleWishlist}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
              <span className="sr-only">Add to favorites</span>
            </Button>
          </div>
          
          {/* Additional Info */}
          <div className="mt-6 grid grid-cols-3 gap-3 border-t border-slate-200 dark:border-slate-700 pt-6">
            <div className="col-span-1 flex items-center">
              <Truck className="h-5 w-5 text-slate-500 dark:text-slate-400" />
              <div className="ml-2">
                <h4 className="text-sm font-medium text-slate-900 dark:text-white">Fast Shipping</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">2-4 business days</p>
              </div>
            </div>
            <div className="col-span-1 flex items-center">
              <RefreshCw className="h-5 w-5 text-slate-500 dark:text-slate-400" />
              <div className="ml-2">
                <h4 className="text-sm font-medium text-slate-900 dark:text-white">Free Returns</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">30 day guarantee</p>
              </div>
            </div>
            <div className="col-span-1 flex items-center">
              <BadgeCheck className="h-5 w-5 text-slate-500 dark:text-slate-400" />
              <div className="ml-2">
                <h4 className="text-sm font-medium text-slate-900 dark:text-white">Warranty</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">1 year coverage</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
