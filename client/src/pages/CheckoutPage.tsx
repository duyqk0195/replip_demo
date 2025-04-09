import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useLocation } from 'wouter';
import { Check, CreditCard, ArrowLeft } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import CartItem from '@/components/cart/CartItem';

// Form validation schema
const checkoutFormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  firstName: z.string().min(2, { message: 'First name must be at least 2 characters' }),
  lastName: z.string().min(2, { message: 'Last name must be at least 2 characters' }),
  address: z.string().min(5, { message: 'Please enter a valid address' }),
  city: z.string().min(2, { message: 'Please enter a valid city' }),
  state: z.string().min(2, { message: 'Please enter a valid state/province' }),
  postalCode: z.string().min(3, { message: 'Please enter a valid postal/zip code' }),
  country: z.string().min(2, { message: 'Please enter a valid country' }),
  paymentMethod: z.enum(['credit', 'paypal', 'bank'], { 
    required_error: 'Please select a payment method' 
  }),
  // Credit Card Fields (only required if payment method is credit)
  cardNumber: z.string().optional(),
  cardName: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvc: z.string().optional(),
}).refine((data) => {
  // Require credit card fields if payment method is credit
  if (data.paymentMethod === 'credit') {
    return !!(data.cardNumber && data.cardName && data.cardExpiry && data.cardCvc);
  }
  return true;
}, {
  message: "Credit card information is required",
  path: ["cardNumber"],
});

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

export default function CheckoutPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const { cartItems, cartTotal, clearCart } = useCart();
  const { toast } = useToast();
  const [_, navigate] = useLocation();
  
  // Initialize form with default values
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      paymentMethod: 'credit',
      cardNumber: '',
      cardName: '',
      cardExpiry: '',
      cardCvc: '',
    },
  });
  
  // Get current payment method
  const watchPaymentMethod = form.watch('paymentMethod');
  
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Check if cart is empty and redirect to cart page
  useEffect(() => {
    if (cartItems.length === 0 && !isComplete) {
      toast({
        title: 'Your cart is empty',
        description: 'Please add some products to your cart before proceeding to checkout.',
        variant: 'destructive',
      });
      navigate('/cart');
    }
  }, [cartItems, isComplete, navigate, toast]);
  
  // Calculate order totals
  const subtotal = cartTotal();
  const shipping = subtotal >= 100 ? 0 : 10;
  const total = subtotal + shipping;
  
  // Form submission handler
  const onSubmit = async (data: CheckoutFormValues) => {
    setIsSubmitting(true);
    
    // Simulate API call for order processing
    try {
      // Wait 1.5 seconds to simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Clear cart on successful order
      clearCart();
      
      // Show success state
      setIsComplete(true);
      
      // Scroll to top to show confirmation
      window.scrollTo(0, 0);
    } catch (error) {
      toast({
        title: 'Checkout failed',
        description: 'There was an error processing your order. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Order confirmation screen
  if (isComplete) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white dark:bg-slate-800 min-h-[600px] flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900">
            <Check className="h-6 w-6 text-green-600 dark:text-green-300" />
          </div>
          <h2 className="mt-3 text-lg font-medium text-slate-900 dark:text-white">Order Complete!</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Thank you for your order. We've received your payment and will be processing your order shortly.
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            A confirmation email has been sent to the email address you provided.
          </p>
          <div className="mt-8 flex justify-center">
            <Link href="/">
              <Button className="px-4 py-2">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Checkout</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Complete your order by providing your details below.
          </p>
        </div>
        
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
          {/* Checkout Form */}
          <div className="lg:col-span-7">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Contact Information */}
                <div className="space-y-4">
                  <h2 className="text-lg font-medium text-slate-900 dark:text-white">Contact Information</h2>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="your@email.com" 
                            {...field} 
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <Separator />
                
                {/* Shipping Address */}
                <div className="space-y-4">
                  <h2 className="text-lg font-medium text-slate-900 dark:text-white">Shipping Address</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="John" 
                              {...field} 
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Doe" 
                              {...field} 
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="123 Main St" 
                            {...field} 
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="New York" 
                              {...field} 
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State / Province</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="NY" 
                              {...field} 
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postal / Zip Code</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="10001" 
                              {...field} 
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="United States" 
                            {...field} 
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <Separator />
                
                {/* Payment Information */}
                <div className="space-y-4">
                  <h2 className="text-lg font-medium text-slate-900 dark:text-white">Payment Method</h2>
                  
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                            disabled={isSubmitting}
                          >
                            <div className="flex items-center space-x-2 py-2 px-4 border border-slate-200 dark:border-slate-700 rounded-md">
                              <RadioGroupItem value="credit" id="payment-credit" />
                              <FormLabel htmlFor="payment-credit" className="flex-1 cursor-pointer">
                                <div className="flex items-center">
                                  <CreditCard className="mr-2 h-5 w-5 text-slate-500 dark:text-slate-400" />
                                  Credit Card
                                </div>
                              </FormLabel>
                            </div>
                            <div className="flex items-center space-x-2 py-2 px-4 border border-slate-200 dark:border-slate-700 rounded-md">
                              <RadioGroupItem value="paypal" id="payment-paypal" />
                              <FormLabel htmlFor="payment-paypal" className="flex-1 cursor-pointer">
                                <div className="flex items-center">
                                  <svg className="mr-2 h-5 w-5 text-[#003087]" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013 1.336-.45 2.796-1.276 4.124-1.357 2.183-3.876 3.383-7.317 3.383H9.305c-.075 0-.15.072-.164.151l-1.5 9.3a.273.273 0 0 0 .27.323h3.26c.075 0 .15-.072.164-.151l.61-3.9a.37.37 0 0 1 .365-.323h1.21c3.39 0 6.088-1.286 7.33-3.83.68-1.393.92-2.857.673-4.536z" />
                                  </svg>
                                  PayPal
                                </div>
                              </FormLabel>
                            </div>
                            <div className="flex items-center space-x-2 py-2 px-4 border border-slate-200 dark:border-slate-700 rounded-md">
                              <RadioGroupItem value="bank" id="payment-bank" />
                              <FormLabel htmlFor="payment-bank" className="flex-1 cursor-pointer">
                                <div className="flex items-center">
                                  <svg className="mr-2 h-5 w-5 text-slate-500 dark:text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="5" width="20" height="14" rx="2" />
                                    <line x1="2" y1="10" x2="22" y2="10" />
                                  </svg>
                                  Bank Transfer
                                </div>
                              </FormLabel>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Credit Card Fields - Only show when credit card is selected */}
                  {watchPaymentMethod === 'credit' && (
                    <Card>
                      <CardContent className="pt-6 space-y-4">
                        <FormField
                          control={form.control}
                          name="cardNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Card Number</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="4242 4242 4242 4242" 
                                  {...field} 
                                  disabled={isSubmitting}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="cardName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Cardholder Name</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="John Doe" 
                                  {...field} 
                                  disabled={isSubmitting}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="cardExpiry"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Expiration Date</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="MM/YY" 
                                    {...field} 
                                    disabled={isSubmitting}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="cardCvc"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>CVC</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="123" 
                                    {...field} 
                                    disabled={isSubmitting}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
                
                <div className="flex justify-between pt-4">
                  <Link href="/cart">
                    <Button type="button" variant="outline" className="flex items-center">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Cart
                    </Button>
                  </Link>
                  
                  <Button 
                    type="submit" 
                    className="w-full md:w-auto px-8"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Processing...' : `Pay $${total.toFixed(2)}`}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
          
          {/* Order Summary */}
          <div className="mt-16 lg:mt-0 lg:col-span-5">
            <div className="bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 px-6 py-6">
              <div className="flow-root">
                <h2 className="text-lg font-medium text-slate-900 dark:text-white">Order Summary</h2>
                
                {cartItems.length > 0 ? (
                  <>
                    <ul className="mt-4 divide-y divide-slate-200 dark:divide-slate-700">
                      {cartItems.map((item) => (
                        <li key={item.id} className="py-4">
                          <CartItem item={item} showControls={false} />
                        </li>
                      ))}
                    </ul>
                    
                    <Separator className="my-4" />
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <p className="text-slate-600 dark:text-slate-400">Subtotal</p>
                        <p className="font-medium text-slate-900 dark:text-white">${subtotal.toFixed(2)}</p>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <div className="flex items-center">
                          <p className="text-slate-600 dark:text-slate-400">Shipping</p>
                          {shipping === 0 && (
                            <span className="ml-1 text-xs bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 py-0.5 px-1.5 rounded-full">
                              Free
                            </span>
                          )}
                        </div>
                        <p className="font-medium text-slate-900 dark:text-white">${shipping.toFixed(2)}</p>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex justify-between text-base">
                        <p className="font-medium text-slate-900 dark:text-white">Total</p>
                        <p className="font-medium text-slate-900 dark:text-white">${total.toFixed(2)}</p>
                      </div>
                      
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                        Free shipping on orders over $100.
                      </p>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">
                    Your cart is empty.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
