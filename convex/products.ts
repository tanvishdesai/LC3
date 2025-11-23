import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
    args: {},
    handler: async (ctx) => {
        const products = await ctx.db.query("products").collect();
        return await Promise.all(
            products.map(async (product) => {
                let imageUrl = product.image;
                // Only attempt to resolve if it looks like a valid Convex storage ID
                // Storage IDs are typically alphanumeric and don't contain slashes or dots (unlike paths/URLs)
                const isStorageId = product.image &&
                    !product.image.includes("/") &&
                    !product.image.includes(".") &&
                    !product.image.startsWith("http");

                if (isStorageId) {
                    try {
                        const url = await ctx.storage.getUrl(product.image);
                        if (url) imageUrl = url;
                    } catch  {
                        console.error("Failed to resolve storage ID:", product.image);
                    }
                }
                return { ...product, image: imageUrl };
            })
        );
    },
});

export const create = mutation({
    args: {
        name: v.string(),
        description: v.string(),
        price: v.number(),
        image: v.string(),
        flavor: v.string(),
        originalPrice: v.optional(v.number()),
        offerText: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("products", args);
    },
});

export const update = mutation({
    args: {
        id: v.id("products"),
        name: v.string(),
        description: v.string(),
        price: v.number(),
        image: v.string(),
        flavor: v.string(),
        originalPrice: v.optional(v.number()),
        offerText: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { id, ...rest } = args;
        await ctx.db.patch(id, rest);
    },
});

export const remove = mutation({
    args: { id: v.id("products") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});

export const generateUploadUrl = mutation(async (ctx) => {
    return await ctx.storage.generateUploadUrl();
});
