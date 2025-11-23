import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
    args: {},
    handler: async (ctx) => {
        const testimonials = await ctx.db.query("testimonials").collect();
        return await Promise.all(
            testimonials.map(async (testimonial) => {
                let imageUrl = testimonial.image;
                const isStorageId = testimonial.image &&
                    !testimonial.image.includes("/") &&
                    !testimonial.image.includes(".") &&
                    !testimonial.image.startsWith("http");

                if (isStorageId) {
                    try {
                        const url = await ctx.storage.getUrl(testimonial.image);
                        if (url) imageUrl = url;
                    } catch {
                        console.error("Failed to resolve storage ID:", testimonial.image);
                    }
                }
                return { ...testimonial, image: imageUrl };
            })
        );
    },
});

export const create = mutation({
    args: {
        name: v.string(),
        content: v.string(),
        rating: v.number(),
        image: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("testimonials", args);
    },
});

export const update = mutation({
    args: {
        id: v.id("testimonials"),
        name: v.string(),
        content: v.string(),
        rating: v.number(),
        image: v.string(),
    },
    handler: async (ctx, args) => {
        const { id, ...rest } = args;
        await ctx.db.patch(id, rest);
    },
});

export const remove = mutation({
    args: { id: v.id("testimonials") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});

export const generateUploadUrl = mutation(async (ctx) => {
    return await ctx.storage.generateUploadUrl();
});
