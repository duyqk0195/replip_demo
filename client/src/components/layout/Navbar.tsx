import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X, ShoppingCart as CartIcon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useCart } from '@/contexts/CartContext';
import ThemeToggle from '@/components/ui/ThemeToggle';
import SearchInput from '@/components/ui/SearchInput';
import ShoppingCart from '@/components/cart/ShoppingCart';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [location] = useLocation();
  const { cartItemsCount } = useCart();

  // Track active nav item
  const isActive = (path: string) => {
    if (path === '/' && location === '/') return true;
    if (path !== '/' && location.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 flex items-center">
              <svg className="h-8 w-auto text-primary-600 dark:text-primary-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"/>
                <path d="M12 10c-1.084 0-2 .916-2 2s.916 2 2 2 2-.916 2-2-.916-2-2-2z"/>
                <path d="M14 16v2h-4v-2m4-10v2h-4V6"/>
              </svg>
              <span className="ml-2 text-xl font-bold text-slate-900 dark:text-white">ArtisanPro</span>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden sm:ml-6 sm:flex sm:space-x-8" aria-label="Main Navigation">
              <Link 
                href="/" 
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/') 
                    ? 'border-primary-500 text-slate-900 dark:text-white' 
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-300 dark:hover:text-white dark:hover:border-slate-600'
                }`}
              >
                Home
              </Link>
              <Link 
                href="/products" 
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/products') 
                    ? 'border-primary-500 text-slate-900 dark:text-white' 
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-300 dark:hover:text-white dark:hover:border-slate-600'
                }`}
              >
                Products
              </Link>
              <Link 
                href="/categories" 
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/categories') 
                    ? 'border-primary-500 text-slate-900 dark:text-white' 
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-300 dark:hover:text-white dark:hover:border-slate-600'
                }`}
              >
                Categories
              </Link>
              <Link 
                href="/custom-orders" 
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/custom-orders') 
                    ? 'border-primary-500 text-slate-900 dark:text-white' 
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-300 dark:hover:text-white dark:hover:border-slate-600'
                }`}
              >
                Custom Orders
              </Link>
              <Link 
                href="/about" 
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/about') 
                    ? 'border-primary-500 text-slate-900 dark:text-white' 
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-300 dark:hover:text-white dark:hover:border-slate-600'
                }`}
              >
                About Us
              </Link>
            </nav>
          </div>
          
          {/* Right side - Search, Dark Mode, and Cart */}
          <div className="flex items-center">
            {/* Search */}
            <div className="relative mx-2 lg:mx-4 hidden sm:block">
              <SearchInput />
            </div>
            
            {/* Dark Mode Toggle */}
            <ThemeToggle />
            
            {/* Shopping Cart */}
            <div className="ml-4 relative flex-shrink-0">
              <button 
                onClick={() => setCartOpen(!cartOpen)} 
                className="relative p-2 rounded-full text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label="Shopping cart"
              >
                <CartIcon className="h-6 w-6" />
                {cartItemsCount() > 0 && (
                  <span 
                    className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-orange-500 rounded-full"
                  >
                    {cartItemsCount()}
                  </span>
                )}
              </button>
              
              {/* Cart Dropdown */}
              {cartOpen && <ShoppingCart onClose={() => setCartOpen(false)} />}
            </div>
            
            {/* Mobile menu button */}
            <div className="sm:hidden ml-2">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                className="inline-flex items-center justify-center p-2 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden" id="mobile-menu">
          <div className="pt-2 pb-3 space-y-1">
            <Link 
              href="/" 
              className={`block pl-3 pr-4 py-2 text-base font-medium border-l-4 ${
                isActive('/') 
                  ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500 text-primary-700 dark:text-primary-300' 
                  : 'border-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              Home
            </Link>
            <Link 
              href="/products" 
              className={`block pl-3 pr-4 py-2 text-base font-medium border-l-4 ${
                isActive('/products') 
                  ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500 text-primary-700 dark:text-primary-300' 
                  : 'border-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              Products
            </Link>
            <Link 
              href="/categories" 
              className={`block pl-3 pr-4 py-2 text-base font-medium border-l-4 ${
                isActive('/categories') 
                  ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500 text-primary-700 dark:text-primary-300' 
                  : 'border-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              Categories
            </Link>
            <Link 
              href="/custom-orders" 
              className={`block pl-3 pr-4 py-2 text-base font-medium border-l-4 ${
                isActive('/custom-orders') 
                  ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500 text-primary-700 dark:text-primary-300' 
                  : 'border-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              Custom Orders
            </Link>
            <Link 
              href="/about" 
              className={`block pl-3 pr-4 py-2 text-base font-medium border-l-4 ${
                isActive('/about') 
                  ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500 text-primary-700 dark:text-primary-300' 
                  : 'border-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              About Us
            </Link>
            
            {/* Mobile search */}
            <div className="px-4 py-2">
              <SearchInput />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
