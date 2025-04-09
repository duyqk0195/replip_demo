import { Link } from 'wouter';

export default function CTASection() {
  return (
    <section className="bg-primary-700 dark:bg-primary-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          <span className="block">Ready to elevate your business?</span>
          <span className="block text-primary-300">Start customizing your handmade products today.</span>
        </h2>
        <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
          <div className="inline-flex rounded-md shadow">
            <Link href="/products" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-white hover:bg-slate-50 transition duration-150 ease-in-out">
              Explore Products
            </Link>
          </div>
          <div className="ml-3 inline-flex rounded-md shadow">
            <Link href="/contact" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-500 transition duration-150 ease-in-out">
              Contact Sales
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
