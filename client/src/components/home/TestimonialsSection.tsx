import { Star, ArrowRight } from 'lucide-react';

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Interior Designer, Johnson Design Studio",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    rating: 5.0,
    text: "The craftsmanship of these products is unmatched. I've been ordering custom pieces for my design clients for years, and the quality and attention to detail has always been exceptional. The custom color matching service is particularly impressive."
  },
  {
    name: "David Miller",
    role: "Corporate Gifts Manager, Tech Innovations Inc.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    rating: 4.5,
    text: "We've been ordering personalized gifts for our executives and clients through ArtisanPro for the past 3 years. The quality is consistent, and the customization options are exactly what we need. Their bulk ordering process is streamlined and efficient."
  },
  {
    name: "Emily Chen",
    role: "Hospitality Manager, Grand Hotel & Spa",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    rating: 5.0,
    text: "Our hotel has been featuring ArtisanPro's ceramic pieces in our guest rooms and restaurant. The feedback has been overwhelmingly positive. The custom glaze colors perfectly match our brand palette, and the durability exceeds hospitality standards."
  }
];

export default function TestimonialsSection() {
  return (
    <section className="py-12 bg-white dark:bg-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base text-primary-600 dark:text-primary-400 font-semibold tracking-wide uppercase">Testimonials</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            What Industry Professionals Say
          </p>
          <p className="mt-4 max-w-2xl text-xl text-slate-600 dark:text-slate-300 lg:mx-auto">
            Don't just take our word for it. Here's what our customers have to say about their experience.
          </p>
        </div>
        
        <div className="mt-10">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-slate-50 dark:bg-slate-900 rounded-lg shadow-sm p-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <img 
                      className="h-12 w-12 rounded-full" 
                      src={testimonial.image} 
                      alt={testimonial.name} 
                    />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white">{testimonial.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{testimonial.role}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <div className="flex text-amber-400">
                    {Array(5).fill(0).map((_, i) => (
                      <Star 
                        key={i} 
                        className="h-4 w-4 fill-current" 
                        fill={i < Math.floor(testimonial.rating) ? "currentColor" : "none"}
                        strokeWidth={i < Math.floor(testimonial.rating) ? 0 : 2}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-slate-500 dark:text-slate-400">{testimonial.rating.toFixed(1)}</span>
                </div>
                <p className="mt-4 text-base text-slate-600 dark:text-slate-300">
                  "{testimonial.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-10 text-center">
          <a href="#" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition duration-150 ease-in-out">
            Read More Testimonials
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
