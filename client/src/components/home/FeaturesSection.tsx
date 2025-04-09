import { Award, Bolt, Clock, Shield, Truck, HeadphonesIcon } from 'lucide-react';

const features = [
  {
    title: "Premium Craftsmanship",
    description: "Each product is crafted by skilled artisans with decades of experience and using only the finest materials.",
    icon: Award
  },
  {
    title: "Custom Solutions",
    description: "Tailor products to your exact specifications with our advanced customization options.",
    icon: Bolt
  },
  {
    title: "Quick Turnaround",
    description: "Even custom orders are processed efficiently to meet your business timeline requirements.",
    icon: Clock
  },
  {
    title: "Quality Guarantee",
    description: "Every product comes with a satisfaction guarantee and comprehensive quality assurance.",
    icon: Shield
  },
  {
    title: "Bulk Ordering",
    description: "Special pricing and logistics solutions for large volume orders for industry professionals.",
    icon: Truck
  },
  {
    title: "Dedicated Support",
    description: "Personalized customer service with industry experts to help you find the perfect solutions.",
    icon: HeadphonesIcon
  }
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-12 bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-primary-600 dark:text-primary-400 font-semibold tracking-wide uppercase">Why Choose Us</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Premium Quality Meets Customization
          </p>
          <p className="mt-4 max-w-2xl text-xl text-slate-600 dark:text-slate-300 lg:mx-auto">
            We combine traditional craftsmanship with modern customization technology to deliver exceptional products.
          </p>
        </div>
        
        <div className="mt-10">
          <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div key={index} className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                  <feature.icon className="h-6 w-6" />
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-slate-900 dark:text-white">{feature.title}</h3>
                  <p className="mt-2 text-base text-slate-600 dark:text-slate-300">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
