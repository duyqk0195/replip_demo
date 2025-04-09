// Product and category types that mirror the schema
export interface Category {
  id: number;
  name: string;
  description: string;
  image: string;
  productCount: number;
}

export interface CustomizationType {
  id: number;
  name: string;
  displayName: string;
  colorHex: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  categoryId: number;
  rating: number;
  image: string;
  images: string[];
  isBestseller: boolean;
  isNew: boolean;
  customizationOptions: number[];
  features: string[];
}

export interface CartItem {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
  customizations: Record<string, any>;
  product?: Product;
}

export interface Cart {
  id: number;
  userId?: number;
  createdAt: string;
  updatedAt: string;
  items?: CartItem[];
}

// For the filter sidebar
export interface PriceRange {
  min?: number;
  max?: number;
}

export interface ProductFilters {
  categoryId?: number;
  priceRange?: PriceRange;
  customizationTypes?: number[];
  search?: string;
  sort?: 'popular' | 'newest' | 'price-asc' | 'price-desc' | 'rating';
  minRating?: number;
}

// Cart context types
export type CartContextType = {
  cart: Cart | null;
  cartItems: CartItem[];
  isLoading: boolean;
  addToCart: (productId: number, quantity: number, customizations: Record<string, any>) => Promise<void>;
  updateCartItemQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  removeCartItem: (cartItemId: number) => Promise<void>;
  clearCart: () => void;
  cartTotal: () => number;
  cartItemsCount: () => number;
};

// Theme context types
export type Theme = 'light' | 'dark';

export type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};
