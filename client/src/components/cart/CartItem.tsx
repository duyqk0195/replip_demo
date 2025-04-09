import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '@/lib/types';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';

interface CartItemProps {
  item: CartItemType;
  showControls?: boolean;
}

export default function CartItem({ item, showControls = true }: CartItemProps) {
  const [isRemoving, setIsRemoving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { removeCartItem, updateCartItemQuantity } = useCart();
  
  if (!item.product) {
    return null;
  }
  
  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      await removeCartItem(item.id);
    } finally {
      setIsRemoving(false);
    }
  };
  
  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity === item.quantity) return;
    
    setIsUpdating(true);
    try {
      await updateCartItemQuantity(item.id, newQuantity);
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Format customizations for display
  const getCustomizationText = () => {
    if (!item.customizations || Object.keys(item.customizations).length === 0) {
      return 'No customization';
    }
    
    return Object.entries(item.customizations)
      .map(([key, value]) => {
        // Format keys for display (capitalize, replace underscores with spaces)
        const formattedKey = key
          .split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        
        // Handle special case for color (capitalize)
        if (key === 'color' && typeof value === 'string') {
          return `${formattedKey}: ${value.charAt(0).toUpperCase() + value.slice(1)}`;
        }
        
        return `${formattedKey}: ${value}`;
      })
      .join(', ');
  };
  
  return (
    <div className={`px-4 py-2 flex items-center hover:bg-slate-100 dark:hover:bg-slate-700 ${isRemoving ? 'opacity-50' : ''}`}>
      <img 
        src={item.product.image} 
        alt={item.product.name} 
        className="w-12 h-12 rounded object-cover"
      />
      <div className="ml-3 flex-1">
        <h4 className="text-sm font-medium text-slate-900 dark:text-white">{item.product.name}</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400">{getCustomizationText()}</p>
        <div className="flex justify-between mt-1">
          <span className="text-xs font-semibold text-slate-900 dark:text-white">
            ${(item.product.price * item.quantity).toFixed(2)}
          </span>
          <div className="flex items-center">
            {showControls ? (
              <div className="flex items-center space-x-2">
                <button
                  className="text-xs px-1 bg-slate-200 dark:bg-slate-700 rounded disabled:opacity-50"
                  onClick={() => handleQuantityChange(item.quantity - 1)}
                  disabled={item.quantity <= 1 || isUpdating}
                >
                  -
                </button>
                <span className="text-xs text-slate-600 dark:text-slate-400">{item.quantity}</span>
                <button
                  className="text-xs px-1 bg-slate-200 dark:bg-slate-700 rounded disabled:opacity-50"
                  onClick={() => handleQuantityChange(item.quantity + 1)}
                  disabled={isUpdating}
                >
                  +
                </button>
              </div>
            ) : (
              <span className="text-xs text-slate-600 dark:text-slate-400">Qty: {item.quantity}</span>
            )}
            <button 
              className="ml-2 text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 disabled:opacity-50"
              onClick={handleRemove}
              disabled={isRemoving}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
