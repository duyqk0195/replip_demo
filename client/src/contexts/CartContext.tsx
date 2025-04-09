import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Cart, CartItem, CartContextType } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch or create cart on component mount
  const { data: cartData, isLoading } = useQuery({
    queryKey: ['/api/carts', cart?.id],
    queryFn: async () => {
      if (!cart?.id) {
        // Create a new cart
        const response = await apiRequest('POST', '/api/carts', {});
        return response.json();
      }
      // Get existing cart
      const response = await fetch(`/api/carts/${cart.id}`, {
        credentials: 'include',
      });
      if (!response.ok) {
        // If cart not found, create a new one
        if (response.status === 404) {
          const newCartResponse = await apiRequest('POST', '/api/carts', {});
          return newCartResponse.json();
        }
        throw new Error('Failed to fetch cart');
      }
      return response.json();
    },
    enabled: true,
    retry: 1,
  });

  // Update cart state when data changes
  useEffect(() => {
    if (cartData) {
      setCart(cartData);
      setCartItems(cartData.items || []);
    }
  }, [cartData]);

  // Initialize cart ID from localStorage
  useEffect(() => {
    const savedCartId = localStorage.getItem('cartId');
    if (savedCartId) {
      setCart(prevCart => ({
        ...(prevCart || {}),
        id: parseInt(savedCartId),
      } as Cart));
    }
  }, []);

  // Save cart ID to localStorage when it changes
  useEffect(() => {
    if (cart?.id) {
      localStorage.setItem('cartId', cart.id.toString());
    }
  }, [cart?.id]);

  // Add item to cart
  const addToCartMutation = useMutation({
    mutationFn: async ({ productId, quantity, customizations }: { productId: number, quantity: number, customizations: Record<string, any> }) => {
      if (!cart?.id) {
        throw new Error('Cart not initialized');
      }
      const response = await apiRequest('POST', '/api/cart-items', {
        cartId: cart.id,
        productId,
        quantity,
        customizations,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/carts', cart?.id] });
      toast({
        title: 'Product added to cart',
        description: 'Your product has been added to the cart',
        variant: 'default',
      });
    },
    onError: (error) => {
      toast({
        title: 'Failed to add product',
        description: error.message || 'An error occurred',
        variant: 'destructive',
      });
    },
  });

  // Update cart item quantity
  const updateQuantityMutation = useMutation({
    mutationFn: async ({ cartItemId, quantity }: { cartItemId: number, quantity: number }) => {
      const response = await apiRequest('PATCH', `/api/cart-items/${cartItemId}`, {
        quantity,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/carts', cart?.id] });
    },
    onError: (error) => {
      toast({
        title: 'Failed to update quantity',
        description: error.message || 'An error occurred',
        variant: 'destructive',
      });
    },
  });

  // Remove item from cart
  const removeItemMutation = useMutation({
    mutationFn: async (cartItemId: number) => {
      await apiRequest('DELETE', `/api/cart-items/${cartItemId}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/carts', cart?.id] });
      toast({
        title: 'Item removed',
        description: 'Item has been removed from your cart',
        variant: 'default',
      });
    },
    onError: (error) => {
      toast({
        title: 'Failed to remove item',
        description: error.message || 'An error occurred',
        variant: 'destructive',
      });
    },
  });

  // Public functions for the context
  const addToCart = async (productId: number, quantity: number, customizations: Record<string, any>) => {
    await addToCartMutation.mutateAsync({ productId, quantity, customizations });
  };

  const updateCartItemQuantity = async (cartItemId: number, quantity: number) => {
    await updateQuantityMutation.mutateAsync({ cartItemId, quantity });
  };

  const removeCartItem = async (cartItemId: number) => {
    await removeItemMutation.mutateAsync(cartItemId);
  };

  const clearCart = () => {
    // Remove all items
    cartItems.forEach(item => {
      removeCartItem(item.id);
    });
  };

  const cartTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.product?.price || 0) * item.quantity;
    }, 0);
  };

  const cartItemsCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartItems,
        isLoading,
        addToCart,
        updateCartItemQuantity,
        removeCartItem,
        clearCart,
        cartTotal,
        cartItemsCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  
  return context;
}
