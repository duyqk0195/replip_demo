import { Link } from 'wouter';

export default function HeroSection() {
  return (
    <section className="relative bg-white dark:bg-slate-800 overflow-hidden transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 py-8 sm:py-16 md:py-20 lg:py-24 xl:py-28">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl tracking-tight font-extrabold text-slate-900 dark:text-white sm:text-5xl md:text-6xl">
              <span className="block">Artisan Excellence for</span>
              <span className="block text-primary-600 dark:text-primary-400">Industry Professionals</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto lg:mx-0 text-base text-slate-600 dark:text-slate-300 sm:text-lg md:mt-5 md:text-xl">
              Premium handcrafted products with customization options that meet your industry standards and requirements.
            </p>
            <div className="mt-8 sm:flex sm:justify-center lg:justify-start">
              <div className="rounded-md shadow">
                <Link href="/products" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10 transition duration-150 ease-in-out">
                  Browse Products
                </Link>
              </div>
              <div className="mt-3 sm:mt-0 sm:ml-3">
                <Link href="/categories" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 dark:text-primary-300 bg-primary-100 dark:bg-primary-900/20 hover:bg-primary-200 dark:hover:bg-primary-900/30 md:py-4 md:text-lg md:px-10 transition duration-150 ease-in-out">
                  View Categories
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden lg:block lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <img 
          src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" 
          alt="Craftsman working on a handmade leather product"
          className="h-full w-full object-cover" 
        />
      </div>
    </section>
  );
}
