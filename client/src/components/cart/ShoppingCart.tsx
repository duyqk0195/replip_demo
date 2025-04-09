import { useRef, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { ShoppingBag } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import CartItem from './CartItem';

interface ShoppingCartProps {
  onClose?: () => void;
}

export default function ShoppingCart({ onClose }: ShoppingCartProps) {
  const { cart, cartItems, cartTotal, cartItemsCount, isLoading } = useCart();
  const [location, navigate] = useLocation();
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node) && onClose) {
        onClose();
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);
  
  // Close dropdown when navigating
  const handleCheckout = () => {
    if (onClose) onClose();
    navigate('/checkout');
  };
  
  const handleViewCart = () => {
    if (onClose) onClose();
    navigate('/cart');
  };
  
  // Empty cart state
  if (cartItemsCount() === 0 && !isLoading) {
    return (
      <div 
        ref={wrapperRef}
        className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
        tabIndex={-1}
        role="menu"
        aria-orientation="vertical"
      >
        <div className="px-4 py-6 text-center">
          <ShoppingBag className="mx-auto h-10 w-10 text-slate-400 dark:text-slate-500" />
          <h3 className="mt-2 text-sm font-medium text-slate-900 dark:text-white">Your cart is empty</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Looks like you haven't added anything to your cart yet.
          </p>
          <div className="mt-4">
            <Button 
              className="w-full"
              onClick={() => {
                if (onClose) onClose();
                navigate('/products');
              }}
            >
              Browse Products
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      ref={wrapperRef}
      className="absolute right-0 mt-2 w-72 sm:w-80 bg-white dark:bg-slate-800 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
      tabIndex={-1}
      role="menu"
      aria-orientation="vertical"
    >
      <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-700">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
          Shopping Cart ({cartItemsCount()})
        </h3>
      </div>
      
      {isLoading ? (
        <div className="px-4 py-4 text-center text-sm text-slate-500 dark:text-slate-400">
          Loading your cart...
        </div>
      ) : (
        <>
          <ScrollArea className="max-h-96 overflow-y-auto py-2">
            {cartItems.map(item => (
              <CartItem key={item.id} item={item} />
            ))}
          </ScrollArea>
          
          <div className="border-t border-slate-200 dark:border-slate-700 px-4 py-2">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-slate-900 dark:text-white">Subtotal</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">${cartTotal().toFixed(2)}</span>
            </div>
            <div className="mt-4 space-y-2">
              <Button 
                className="w-full bg-primary-600 hover:bg-primary-700"
                onClick={handleCheckout}
              >
                Checkout
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleViewCart}
              >
                View Cart
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
