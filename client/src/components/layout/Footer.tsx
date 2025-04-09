import { Link } from 'wouter';
import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <div className="flex items-center">
              <svg className="h-10 w-auto text-primary-600 dark:text-primary-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"/>
                <path d="M12 10c-1.084 0-2 .916-2 2s.916 2 2 2 2-.916 2-2-.916-2-2-2z"/>
                <path d="M14 16v2h-4v-2m4-10v2h-4V6"/>
              </svg>
              <span className="ml-3 text-xl font-bold text-slate-900 dark:text-white">ArtisanPro</span>
            </div>
            <p className="text-base text-slate-600 dark:text-slate-300">
              Premium handcrafted products with custom options for industry professionals. Quality, craftsmanship, and personalization.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider dark:text-slate-300">
                  Products
                </h3>
                <ul role="list" className="mt-4 space-y-4">
                  <li>
                    <Link href="/products?category=1" className="text-base text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
                      Leather Goods
                    </Link>
                  </li>
                  <li>
                    <Link href="/products?category=2" className="text-base text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
                      Ceramics
                    </Link>
                  </li>
                  <li>
                    <Link href="/products?category=3" className="text-base text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
                      Woodcraft
                    </Link>
                  </li>
                  <li>
                    <Link href="/products?category=4" className="text-base text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
                      Textiles
                    </Link>
                  </li>
                  <li>
                    <Link href="/custom-orders" className="text-base text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
                      Custom Orders
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider dark:text-slate-300">
                  Customization
                </h3>
                <ul role="list" className="mt-4 space-y-4">
                  <li>
                    <Link href="/products?customization=1" className="text-base text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
                      Engraving
                    </Link>
                  </li>
                  <li>
                    <Link href="/products?customization=2" className="text-base text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
                      Color Options
                    </Link>
                  </li>
                  <li>
                    <Link href="/products?customization=3" className="text-base text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
                      Material Selection
                    </Link>
                  </li>
                  <li>
                    <Link href="/products?customization=4" className="text-base text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
                      Custom Sizing
                    </Link>
                  </li>
                  <li>
                    <Link href="/bulk-orders" className="text-base text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
                      Bulk Orders
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider dark:text-slate-300">
                  Company
                </h3>
                <ul role="list" className="mt-4 space-y-4">
                  <li>
                    <Link href="/about" className="text-base text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog" className="text-base text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link href="/jobs" className="text-base text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
                      Jobs
                    </Link>
                  </li>
                  <li>
                    <Link href="/partners" className="text-base text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
                      Partners
                    </Link>
                  </li>
                  <li>
                    <Link href="/press" className="text-base text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
                      Press
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider dark:text-slate-300">
                  Support
                </h3>
                <ul role="list" className="mt-4 space-y-4">
                  <li>
                    <Link href="/contact" className="text-base text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/help" className="text-base text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
                      Help Center
                    </Link>
                  </li>
                  <li>
                    <Link href="/faq" className="text-base text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
                      FAQs
                    </Link>
                  </li>
                  <li>
                    <Link href="/shipping" className="text-base text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
                      Shipping Info
                    </Link>
                  </li>
                  <li>
                    <Link href="/returns" className="text-base text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
                      Returns
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-slate-200 dark:border-slate-700 pt-8">
          <p className="text-base text-slate-500 dark:text-slate-400 text-center">
            &copy; {new Date().getFullYear()} ArtisanPro, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
