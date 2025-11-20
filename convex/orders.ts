import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createOrder = mutation({
    args: {
        name: v.string(),
        deliveryAddress: v.string(),
        products: v.array(v.object({
            productName: v.string(),
            quantity: v.number(),
        })),
    },
    handler: async (ctx, args) => {
        const orderId = await ctx.db.insert("orders", {
            name: args.name,
            deliveryAddress: args.deliveryAddress,
            products: args.products,
            status: "pending",
            createdAt: Date.now(),
        });
        return orderId;
    },
});

export const getOrders = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("orders").order("desc").collect();
    },
});

export const getOrderById = query({
    args: { id: v.id("orders") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});
