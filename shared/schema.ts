import { pgTable, text, serial, integer, boolean, jsonb, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Categories
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  productCount: integer("product_count").notNull().default(0),
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  description: true,
  image: true,
  productCount: true,
});

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

// Customization options
export const customizationTypes = pgTable("customization_types", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(), // e.g., "Engraving", "Color Options", "Custom Size"
  displayName: text("display_name").notNull(), // For display purposes
  colorHex: text("color_hex").notNull(), // For UI display (tag background color)
});

export const insertCustomizationTypeSchema = createInsertSchema(customizationTypes).pick({
  name: true,
  displayName: true,
  colorHex: true,
});

export type InsertCustomizationType = z.infer<typeof insertCustomizationTypeSchema>;
export type CustomizationType = typeof customizationTypes.$inferSelect;

// Products
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  shortDescription: text("short_description").notNull(),
  price: doublePrecision("price").notNull(),
  categoryId: integer("category_id").notNull(),
  rating: doublePrecision("rating").notNull().default(5.0),
  image: text("image").notNull(),
  images: jsonb("images").notNull().default([]), // Array of additional images
  isBestseller: boolean("is_bestseller").notNull().default(false),
  isNew: boolean("is_new").notNull().default(false),
  customizationOptions: jsonb("customization_options").notNull().default([]), // Array of customization type IDs
  features: jsonb("features").notNull().default([]), // Array of feature strings
});

export const insertProductSchema = createInsertSchema(products).pick({
  name: true,
  description: true,
  shortDescription: true,
  price: true,
  categoryId: true,
  rating: true,
  image: true,
  images: true,
  isBestseller: true,
  isNew: true,
  customizationOptions: true,
  features: true,
});

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

// User (using the existing users table)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  name: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Cart
export const carts = pgTable("carts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"), // Can be null for anonymous carts
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const insertCartSchema = createInsertSchema(carts).pick({
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertCart = z.infer<typeof insertCartSchema>;
export type Cart = typeof carts.$inferSelect;

// Cart Items
export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  cartId: integer("cart_id").notNull(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull().default(1),
  customizations: jsonb("customizations").notNull().default({}), // JSON object for customization selections
});

export const insertCartItemSchema = createInsertSchema(cartItems).pick({
  cartId: true,
  productId: true,
  quantity: true,
  customizations: true,
});

export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type CartItem = typeof cartItems.$inferSelect;
