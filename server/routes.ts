import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage, ProductFilters } from "./storage";
import { z } from "zod";
import { insertCartItemSchema } from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // prefix all routes with /api
  
  // Get all categories
  app.get("/api/categories", async (req: Request, res: Response) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });
  
  // Get a single category by ID
  app.get("/api/categories/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      
      const category = await storage.getCategoryById(id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch category" });
    }
  });
  
  // Get all products with optional filters
  app.get("/api/products", async (req: Request, res: Response) => {
    try {
      const filters: ProductFilters = {};
      
      // Apply category filter
      if (req.query.categoryId) {
        filters.categoryId = parseInt(req.query.categoryId as string);
      }
      
      // Apply price range filter
      if (req.query.minPrice || req.query.maxPrice) {
        filters.priceRange = {};
        if (req.query.minPrice) {
          filters.priceRange.min = parseFloat(req.query.minPrice as string);
        }
        if (req.query.maxPrice) {
          filters.priceRange.max = parseFloat(req.query.maxPrice as string);
        }
      }
      
      // Apply customization types filter
      if (req.query.customizationTypes) {
        const typesParam = req.query.customizationTypes as string;
        filters.customizationTypes = typesParam.split(',').map(id => parseInt(id));
      }
      
      // Apply search filter
      if (req.query.search) {
        filters.search = req.query.search as string;
      }
      
      // Apply sort filter
      if (req.query.sort) {
        const sortParam = req.query.sort as string;
        if (['popular', 'newest', 'price-asc', 'price-desc', 'rating'].includes(sortParam)) {
          filters.sort = sortParam as any;
        }
      }
      
      // Apply rating filter
      if (req.query.minRating) {
        filters.minRating = parseFloat(req.query.minRating as string);
      }
      
      const products = await storage.getProducts(filters);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });
  
  // Get a single product by ID
  app.get("/api/products/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      const product = await storage.getProductById(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });
  
  // Get featured products
  app.get("/api/featured-products", async (req: Request, res: Response) => {
    try {
      let limit: number | undefined = undefined;
      if (req.query.limit) {
        limit = parseInt(req.query.limit as string);
      }
      
      const products = await storage.getFeaturedProducts(limit);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured products" });
    }
  });
  
  // Get all customization types
  app.get("/api/customization-types", async (req: Request, res: Response) => {
    try {
      const types = await storage.getCustomizationTypes();
      res.json(types);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch customization types" });
    }
  });
  
  // Cart operations
  
  // Create a new cart
  app.post("/api/carts", async (req: Request, res: Response) => {
    try {
      const now = new Date().toISOString();
      const cart = await storage.createCart({
        userId: req.body.userId,
        createdAt: now,
        updatedAt: now
      });
      res.status(201).json(cart);
    } catch (error) {
      res.status(500).json({ message: "Failed to create cart" });
    }
  });
  
  // Get a cart by ID
  app.get("/api/carts/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid cart ID" });
      }
      
      const cart = await storage.getCartById(id);
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
      
      // Get cart items
      const cartItems = await storage.getCartItems(cart.id);
      
      // Get product details for each item
      const itemsWithDetails = await Promise.all(
        cartItems.map(async (item) => {
          const product = await storage.getProductById(item.productId);
          return {
            ...item,
            product
          };
        })
      );
      
      res.json({
        ...cart,
        items: itemsWithDetails
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cart" });
    }
  });
  
  // Add item to cart
  app.post("/api/cart-items", async (req: Request, res: Response) => {
    try {
      const cartItemData = insertCartItemSchema.parse(req.body);
      
      // Verify the product exists
      const product = await storage.getProductById(cartItemData.productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      // Verify the cart exists
      const cart = await storage.getCartById(cartItemData.cartId);
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
      
      const cartItem = await storage.addCartItem(cartItemData);
      
      // Get the product details to include in response
      const itemWithProduct = {
        ...cartItem,
        product
      };
      
      res.status(201).json(itemWithProduct);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid cart item data", errors: error.format() });
      }
      res.status(500).json({ message: "Failed to add item to cart" });
    }
  });
  
  // Update cart item quantity
  app.patch("/api/cart-items/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid cart item ID" });
      }
      
      const quantitySchema = z.object({
        quantity: z.number().min(1).int()
      });
      
      const { quantity } = quantitySchema.parse(req.body);
      
      const updatedItem = await storage.updateCartItemQuantity(id, quantity);
      if (!updatedItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      
      // Get the product details to include in response
      const product = await storage.getProductById(updatedItem.productId);
      
      res.json({
        ...updatedItem,
        product
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid quantity", errors: error.format() });
      }
      res.status(500).json({ message: "Failed to update cart item" });
    }
  });
  
  // Remove item from cart
  app.delete("/api/cart-items/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid cart item ID" });
      }
      
      const success = await storage.removeCartItem(id);
      if (!success) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to remove item from cart" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
