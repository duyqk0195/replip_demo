import { 
  Category, InsertCategory, 
  Product, InsertProduct, 
  CustomizationType, InsertCustomizationType,
  Cart, InsertCart,
  CartItem, InsertCartItem,
  User, InsertUser
} from "@shared/schema";

// modify the interface with any CRUD methods
// you might need
export interface IStorage {
  // Categories
  getCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Products
  getProducts(filters?: ProductFilters): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  getProductsByCategory(categoryId: number): Promise<Product[]>;
  getFeaturedProducts(limit?: number): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;

  // Customization Types
  getCustomizationTypes(): Promise<CustomizationType[]>;
  getCustomizationTypeById(id: number): Promise<CustomizationType | undefined>;
  createCustomizationType(type: InsertCustomizationType): Promise<CustomizationType>;

  // Cart
  getCartById(id: number): Promise<Cart | undefined>;
  getCartByUserId(userId: number): Promise<Cart | undefined>;
  createCart(cart: InsertCart): Promise<Cart>;
  
  // Cart Items
  getCartItems(cartId: number): Promise<CartItem[]>;
  addCartItem(item: InsertCartItem): Promise<CartItem>;
  updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined>;
  removeCartItem(id: number): Promise<boolean>;
  
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

// Filter interface for products
export interface ProductFilters {
  categoryId?: number;
  priceRange?: { min?: number; max?: number };
  customizationTypes?: number[];
  search?: string;
  sort?: 'popular' | 'newest' | 'price-asc' | 'price-desc' | 'rating';
  minRating?: number;
}

export class MemStorage implements IStorage {
  private categories: Map<number, Category>;
  private products: Map<number, Product>;
  private customizationTypes: Map<number, CustomizationType>;
  private carts: Map<number, Cart>;
  private cartItems: Map<number, CartItem>;
  private users: Map<number, User>;
  
  private currentCategoryId: number;
  private currentProductId: number;
  private currentCustomizationTypeId: number;
  private currentCartId: number;
  private currentCartItemId: number;
  private currentUserId: number;

  constructor() {
    this.categories = new Map();
    this.products = new Map();
    this.customizationTypes = new Map();
    this.carts = new Map();
    this.cartItems = new Map();
    this.users = new Map();
    
    this.currentCategoryId = 1;
    this.currentProductId = 1;
    this.currentCustomizationTypeId = 1;
    this.currentCartId = 1;
    this.currentCartItemId = 1;
    this.currentUserId = 1;
    
    // Initialize with some data
    this.initializeData();
  }
  
  private initializeData() {
    // Create customization types
    const engravingType = this.createCustomizationType({
      name: "engraving",
      displayName: "Engraving",
      colorHex: "#93c5fd", // blue-100 in Tailwind
    });
    
    const colorOptionsType = this.createCustomizationType({
      name: "color_options",
      displayName: "Color Options",
      colorHex: "#bbf7d0", // green-100 in Tailwind
    });
    
    const customSizeType = this.createCustomizationType({
      name: "custom_size",
      displayName: "Custom Size",
      colorHex: "#d8b4fe", // purple-100 in Tailwind
    });
    
    const customConfigType = this.createCustomizationType({
      name: "custom_config",
      displayName: "Custom Config",
      colorHex: "#fde68a", // yellow-100 in Tailwind
    });
    
    const monogramType = this.createCustomizationType({
      name: "monogram",
      displayName: "Monogram",
      colorHex: "#93c5fd", // blue-100 in Tailwind
    });
    
    // Create categories
    const leatherCategory = this.createCategory({
      name: "Leather Goods",
      description: "Wallets, belts, bags & more",
      image: "https://images.unsplash.com/photo-1605020420620-20c943cc4669?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      productCount: 42
    });
    
    const ceramicsCategory = this.createCategory({
      name: "Ceramics",
      description: "Mugs, plates, decor & art",
      image: "https://images.unsplash.com/photo-1528283648649-33347faa5d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      productCount: 38
    });
    
    const woodcraftCategory = this.createCategory({
      name: "Woodcraft",
      description: "Furniture, gifts & decor",
      image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      productCount: 51
    });
    
    const textilesCategory = this.createCategory({
      name: "Textiles",
      description: "Accessories, decor & apparel",
      image: "https://images.unsplash.com/photo-1544457070-4cd773b4d71e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      productCount: 29
    });
    
    // Create products
    this.createProduct({
      name: "Leather Journal",
      description: "Our handcrafted leather journal is made from premium full-grain leather that develops a beautiful patina over time. Each journal is carefully assembled by skilled artisans with decades of experience. The journal features 192 pages of acid-free paper that works well with a variety of writing instruments. The binding allows the journal to lay flat when open, making writing comfortable and convenient.",
      shortDescription: "Customizable cover & pages",
      price: 79.99,
      categoryId: leatherCategory.id,
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1602028915047-37269d1a73f7?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      images: [
        "https://images.unsplash.com/photo-1602028915047-37269d1a73f7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1590333748338-d629e4564ad9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1544239605-4c4cc25aa55a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1544377570-7b7fed7d408e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      ],
      isBestseller: true,
      isNew: false,
      customizationOptions: [engravingType.id, customSizeType.id],
      features: [
        "Full-grain leather cover",
        "Refillable design",
        "192 acid-free pages (96 sheets)",
        "Lay-flat binding",
        "Inner pocket for loose papers",
        "Elastic closure"
      ]
    });
    
    this.createProduct({
      name: "Ceramic Mug Set",
      description: "Handcrafted ceramic mugs perfect for your morning coffee or tea. Each mug is carefully made and glazed by our skilled artisans.",
      shortDescription: "Set of 4, multiple glazes",
      price: 119.99,
      categoryId: ceramicsCategory.id,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1556760467-2a8243a7387f?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      images: [
        "https://images.unsplash.com/photo-1556760467-2a8243a7387f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      ],
      isBestseller: false,
      isNew: false,
      customizationOptions: [colorOptionsType.id, monogramType.id],
      features: [
        "Handcrafted ceramic",
        "Microwave and dishwasher safe",
        "12oz capacity",
        "Multiple glaze options",
        "Non-toxic materials"
      ]
    });
    
    this.createProduct({
      name: "Wooden Desk Organizer",
      description: "Keep your workspace tidy with this handcrafted wooden desk organizer. Features multiple compartments for all your office essentials.",
      shortDescription: "Modular design, oak finish",
      price: 149.99,
      categoryId: woodcraftCategory.id,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      images: [
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      ],
      isBestseller: false,
      isNew: true,
      customizationOptions: [customConfigType.id, engravingType.id],
      features: [
        "Solid oak construction",
        "Multiple compartments",
        "Modular design",
        "Felt-lined drawers",
        "Customizable layout"
      ]
    });
    
    this.createProduct({
      name: "Textile Wall Hanging",
      description: "Add texture and warmth to your space with this handwoven wall hanging. Made from natural fibers with a unique design.",
      shortDescription: "Handwoven, natural fibers",
      price: 199.99,
      categoryId: textilesCategory.id,
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1622560480654-d96214fdc887?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      images: [
        "https://images.unsplash.com/photo-1622560480654-d96214fdc887?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      ],
      isBestseller: false,
      isNew: false,
      customizationOptions: [colorOptionsType.id, customSizeType.id],
      features: [
        "Handwoven design",
        "Natural fibers",
        "Wooden dowel included",
        "Multiple size options",
        "Customizable colors"
      ]
    });
    
    this.createProduct({
      name: "Glass Pendant Light",
      description: "Illuminate your space with our handblown glass pendant lights. Each piece is unique with subtle variations in color and form.",
      shortDescription: "Blown glass, multiple shapes",
      price: 249.99,
      categoryId: ceramicsCategory.id,
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1600857544200-b2f666a9a2fc?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      images: [
        "https://images.unsplash.com/photo-1600857544200-b2f666a9a2fc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      ],
      isBestseller: false,
      isNew: false,
      customizationOptions: [colorOptionsType.id, customConfigType.id],
      features: [
        "Handblown glass",
        "E26 standard socket",
        "Adjustable cord length",
        "Multiple color options",
        "Custom shape options"
      ]
    });
    
    this.createProduct({
      name: "Metal Card Holder",
      description: "Keep your business cards organized and accessible with this sleek metal card holder. Available in brushed steel or brass finish.",
      shortDescription: "Brushed steel, brass options",
      price: 69.99,
      categoryId: leatherCategory.id,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1584811644165-33db2e427a08?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      images: [
        "https://images.unsplash.com/photo-1584811644165-33db2e427a08?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      ],
      isBestseller: true,
      isNew: false,
      customizationOptions: [engravingType.id, colorOptionsType.id],
      features: [
        "Solid metal construction",
        "Holds up to 20 business cards",
        "Multiple finish options",
        "Non-slip base",
        "Optional engraving"
      ]
    });
    
    this.createProduct({
      name: "Leather Portfolio",
      description: "Carry your documents in style with this premium leather portfolio. Features multiple pockets and a notepad holder.",
      shortDescription: "Full-grain leather, A4 size",
      price: 179.99,
      categoryId: leatherCategory.id,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1584589167171-541ce45f1eea?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      images: [
        "https://images.unsplash.com/photo-1584589167171-541ce45f1eea?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      ],
      isBestseller: false,
      isNew: false,
      customizationOptions: [colorOptionsType.id, monogramType.id],
      features: [
        "Full-grain leather",
        "A4 size capacity",
        "Multiple document pockets",
        "Pen holder",
        "Included notepad",
        "Optional monogramming"
      ]
    });
    
    this.createProduct({
      name: "Wooden Desk Nameplate",
      description: "Add a touch of personalization to your desk with this handcrafted wooden nameplate. Available in walnut, oak, or maple.",
      shortDescription: "Walnut, oak, or maple",
      price: 59.99,
      categoryId: woodcraftCategory.id,
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1531661339613-3aa1c7fb1fdc?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      images: [
        "https://images.unsplash.com/photo-1531661339613-3aa1c7fb1fdc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      ],
      isBestseller: false,
      isNew: true,
      customizationOptions: [engravingType.id, colorOptionsType.id],
      features: [
        "Solid hardwood construction",
        "Choice of wood types",
        "Precision engraving",
        "Desk or wall mount options",
        "Natural oil finish"
      ]
    });
  }
  
  // Categories
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }
  
  async getCategoryById(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }
  
  async createCategory(category: InsertCategory): Promise<Category> {
    const id = this.currentCategoryId++;
    const newCategory: Category = { ...category, id };
    this.categories.set(id, newCategory);
    return newCategory;
  }
  
  // Products
  async getProducts(filters?: ProductFilters): Promise<Product[]> {
    let products = Array.from(this.products.values());
    
    if (filters) {
      // Filter by category
      if (filters.categoryId) {
        products = products.filter(p => p.categoryId === filters.categoryId);
      }
      
      // Filter by price range
      if (filters.priceRange) {
        if (filters.priceRange.min !== undefined) {
          products = products.filter(p => p.price >= filters.priceRange!.min!);
        }
        if (filters.priceRange.max !== undefined) {
          products = products.filter(p => p.price <= filters.priceRange!.max!);
        }
      }
      
      // Filter by customization types
      if (filters.customizationTypes && filters.customizationTypes.length > 0) {
        products = products.filter(p => 
          filters.customizationTypes!.some(typeId => 
            (p.customizationOptions as number[]).includes(typeId)
          )
        );
      }
      
      // Filter by search term
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        products = products.filter(p => 
          p.name.toLowerCase().includes(searchLower) || 
          p.description.toLowerCase().includes(searchLower) ||
          p.shortDescription.toLowerCase().includes(searchLower)
        );
      }
      
      // Filter by minimum rating
      if (filters.minRating) {
        products = products.filter(p => p.rating >= filters.minRating!);
      }
      
      // Sort results
      if (filters.sort) {
        switch (filters.sort) {
          case 'popular':
            products.sort((a, b) => b.rating - a.rating);
            break;
          case 'newest':
            products.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
            break;
          case 'price-asc':
            products.sort((a, b) => a.price - b.price);
            break;
          case 'price-desc':
            products.sort((a, b) => b.price - a.price);
            break;
          case 'rating':
            products.sort((a, b) => b.rating - a.rating);
            break;
        }
      }
    }
    
    return products;
  }
  
  async getProductById(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }
  
  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.categoryId === categoryId);
  }
  
  async getFeaturedProducts(limit?: number): Promise<Product[]> {
    let products = Array.from(this.products.values());
    
    // Sort by bestseller, then by new
    products.sort((a, b) => {
      if (a.isBestseller && !b.isBestseller) return -1;
      if (!a.isBestseller && b.isBestseller) return 1;
      if (a.isNew && !b.isNew) return -1;
      if (!a.isNew && b.isNew) return 1;
      return b.rating - a.rating;
    });
    
    if (limit) {
      products = products.slice(0, limit);
    }
    
    return products;
  }
  
  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const newProduct: Product = { ...product, id };
    this.products.set(id, newProduct);
    return newProduct;
  }
  
  // Customization Types
  async getCustomizationTypes(): Promise<CustomizationType[]> {
    return Array.from(this.customizationTypes.values());
  }
  
  async getCustomizationTypeById(id: number): Promise<CustomizationType | undefined> {
    return this.customizationTypes.get(id);
  }
  
  async createCustomizationType(type: InsertCustomizationType): Promise<CustomizationType> {
    const id = this.currentCustomizationTypeId++;
    const newType: CustomizationType = { ...type, id };
    this.customizationTypes.set(id, newType);
    return newType;
  }
  
  // Cart
  async getCartById(id: number): Promise<Cart | undefined> {
    return this.carts.get(id);
  }
  
  async getCartByUserId(userId: number): Promise<Cart | undefined> {
    return Array.from(this.carts.values()).find(c => c.userId === userId);
  }
  
  async createCart(cart: InsertCart): Promise<Cart> {
    const id = this.currentCartId++;
    const newCart: Cart = { ...cart, id };
    this.carts.set(id, newCart);
    return newCart;
  }
  
  // Cart Items
  async getCartItems(cartId: number): Promise<CartItem[]> {
    return Array.from(this.cartItems.values()).filter(ci => ci.cartId === cartId);
  }
  
  async addCartItem(item: InsertCartItem): Promise<CartItem> {
    const id = this.currentCartItemId++;
    const newItem: CartItem = { ...item, id };
    this.cartItems.set(id, newItem);
    return newItem;
  }
  
  async updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined> {
    const item = this.cartItems.get(id);
    if (item) {
      const updatedItem = { ...item, quantity };
      this.cartItems.set(id, updatedItem);
      return updatedItem;
    }
    return undefined;
  }
  
  async removeCartItem(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }
  
  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.username === username);
  }
  
  async createUser(user: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const newUser: User = { ...user, id };
    this.users.set(id, newUser);
    return newUser;
  }
}

export const storage = new MemStorage();
