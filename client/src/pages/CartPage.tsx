import { useEffect } from 'react';
import { Link } from 'wouter';
import { ShoppingCart as CartIcon, ChevronRight, ArrowLeft } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import CartItem from '@/components/cart/CartItem';

export default function CartPage() {
  const { cartItems, cartTotal, isLoading, clearCart } = useCart();
  
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Empty cart state
  if (cartItems.length === 0 && !isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white dark:bg-slate-800 min-h-[600px] flex items-center justify-center">
        <div className="text-center">
          <CartIcon className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500" />
          <h2 className="mt-2 text-lg font-medium text-slate-900 dark:text-white">Your cart is empty</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Looks like you haven't added any products to your cart yet.
          </p>
          <div className="mt-6">
            <Link href="/products">
              <Button className="px-4 py-2">
                Browse Products
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  // Calculate shipping cost (free over $100)
  const subtotal = cartTotal();
  const shipping = subtotal >= 100 ? 0 : 10;
  const total = subtotal + shipping;
  
  return (
    <div className="bg-white dark:bg-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Shopping Cart</h1>
        
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
          <div className="lg:col-span-7">
            {isLoading ? (
              <div className="text-center py-4">
                <p className="text-slate-600 dark:text-slate-400">Loading your cart...</p>
              </div>
            ) : (
              <>
                <ul role="list" className="border-t border-b border-slate-200 dark:border-slate-700 divide-y divide-slate-200 dark:divide-slate-700">
                  {cartItems.map(item => (
                    <li key={item.id} className="py-6 flex">
                      <div className="flex-shrink-0 w-24 h-24 border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden">
                        <img
                          src={item.product?.image}
                          alt={item.product?.name}
                          className="w-full h-full object-center object-cover"
                        />
                      </div>

                      <div className="ml-4 flex-1 flex flex-col">
                        <div>
                          <div className="flex justify-between text-base font-medium text-slate-900 dark:text-white">
                            <h3>
                              <Link href={`/product/${item.productId}`}>
                                {item.product?.name}
                              </Link>
                            </h3>
                            <p className="ml-4">${(item.product?.price || 0).toFixed(2)}</p>
                          </div>
                          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            {Object.keys(item.customizations || {}).length > 0 
                              ? Object.entries(item.customizations)
                                  .map(([key, value]) => `${key}: ${value}`)
                                  .join(', ')
                              : 'No customization'
                            }
                          </p>
                        </div>
                        <div className="flex-1 flex items-end justify-between text-sm">
                          <div className="flex items-center">
                            <label htmlFor={`quantity-${item.id}`} className="mr-2 text-slate-600 dark:text-slate-400">
                              Qty
                            </label>
                            <select
                              id={`quantity-${item.id}`}
                              name={`quantity-${item.id}`}
                              value={item.quantity}
                              onChange={(e) => {
                                const quantity = parseInt(e.target.value);
                                if (quantity === 0) {
                                  // Handle remove
                                  const shouldRemove = window.confirm("Remove this item from cart?");
                                  if (shouldRemove) {
                                    // This cartItem component will handle removal
                                  }
                                } else {
                                  // Use the cart context method
                                }
                              }}
                              className="max-w-full rounded-md border border-slate-300 dark:border-slate-700 py-1.5 text-base leading-5 font-medium text-slate-700 dark:text-slate-200 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-slate-800"
                            >
                              <option value={0}>Remove</option>
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                <option key={num} value={num}>
                                  {num}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="flex">
                            <button
                              type="button"
                              className="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300"
                              onClick={() => {
                                // Remove item
                              }}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                
                <div className="flex justify-between mt-6">
                  <Link href="/products">
                    <Button variant="outline" className="flex items-center gap-2">
                      <ArrowLeft className="h-4 w-4" />
                      Continue Shopping
                    </Button>
                  </Link>
                  
                  <Button 
                    variant="destructive" 
                    className="flex items-center gap-2"
                    onClick={() => {
                      if (window.confirm("Are you sure you want to clear your cart?")) {
                        clearCart();
                      }
                    }}
                  >
                    Clear Cart
                  </Button>
                </div>
              </>
            )}
          </div>
          
          {/* Order Summary */}
          <div className="mt-16 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-4 py-6 sm:p-6 lg:p-8 lg:mt-0 lg:col-span-5">
            <h2 className="text-lg font-medium text-slate-900 dark:text-white">Order Summary</h2>
            
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600 dark:text-slate-400">Subtotal</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white">${subtotal.toFixed(2)}</p>
              </div>
              
              <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-700 pt-4">
                <div className="flex items-center">
                  <p className="text-sm text-slate-600 dark:text-slate-400">Shipping</p>
                  {shipping === 0 && (
                    <span className="ml-1 text-xs font-medium bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 py-0.5 px-1.5 rounded-full">
                      Free
                    </span>
                  )}
                </div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">${shipping.toFixed(2)}</p>
              </div>
              
              <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-700 pt-4">
                <p className="text-base font-medium text-slate-900 dark:text-white">Order Total</p>
                <p className="text-base font-medium text-slate-900 dark:text-white">${total.toFixed(2)}</p>
              </div>
            </div>
            
            <div className="mt-6">
              <Link href="/checkout">
                <Button className="w-full py-3 text-base">
                  Proceed to Checkout
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
              <p>
                Free shipping on orders over $100.
                <br />
                Estimated delivery: 2-4 business days
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
