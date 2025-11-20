import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    products: defineTable({
        name: v.string(),
        description: v.string(),
        price: v.number(),
        image: v.string(),
        flavor: v.string(),
    }),
    testimonials: defineTable({
        name: v.string(),
        content: v.string(),
        rating: v.number(),
        image: v.string(),
    }),
    contacts: defineTable({
        name: v.string(),
        email: v.string(),
        message: v.string(),
    }),
    orders: defineTable({
        name: v.string(),
        deliveryAddress: v.string(),
        products: v.array(v.object({
            productName: v.string(),
            quantity: v.number(),
        })),
        status: v.string(),
        createdAt: v.number(),
    }),
});
